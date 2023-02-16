/* eslint camelcase: off */
import Papa from 'papaparse'
import got from 'got'
import {chain, memoize, groupBy} from 'lodash-es'
import adressesUtils from '@ban-team/adresses-util'
import leven from 'leven'
import chalk from 'chalk'
import {bbox, featureCollection, dissolve, intersect} from '@turf/turf'
import voronoi from './voronoi.js'
import {getContour} from './contours.js'

async function getAdresses(codeCommune) {
  try {
    const banData = await got(`https://plateforme.adresse.data.gouv.fr/ban/communes/${codeCommune}/download/csv-bal/adresses`).text()
    return Papa.parse(banData, {delimiter: ';', header: true}).data
  } catch {
    return null
  }
}

export async function buildCarteSecteurFeatures(codeCommune, rows, colleges) {
  const memoizeNormalize = memoize(adressesUtils.normalize)

  for (const r of rows) {
    r.libelle_normalise = memoizeNormalize(r.type_et_libelle)

    if (r.n_de_voie_debut) {
      r.n_de_voie_debut = Number.parseInt(r.n_de_voie_debut, 10)
    }

    if (r.n_de_voie_fin) {
      r.n_de_voie_fin = Number.parseInt(r.n_de_voie_fin, 10)
    }
  }

  const carteGroups = groupBy(rows, 'libelle_normalise')

  const voiesCarte = chain(rows).map('libelle_normalise').uniq().value()

  const adresses = await getAdresses(codeCommune)

  if (!adresses || adresses.length === 0) {
    console.log(chalk.redBright(`${codeCommune} | Adresses Base Adresse Nationale indisponibles`))
    return
  }

  for (const r of adresses) {
    r.libelle_normalise = memoizeNormalize(r.voie_nom)
  }

  const voiesBan = chain(adresses).map('libelle_normalise').uniq().value()

  const mapping = new Map()

  for (const voieCarte of voiesCarte) {
    let minLeven = 9999
    let bestResult

    for (const voieBan of voiesBan) {
      const d = leven(voieBan, voieCarte)
      if (d < minLeven) {
        minLeven = d
        bestResult = voieBan
      }
    }

    const maxSize = Math.max(voieCarte.length, bestResult.length)
    const score = (maxSize - minLeven) / maxSize

    if (score > 0.8) {
      mapping.set(bestResult, voieCarte)
    }
  }

  const adressesFeatures = []

  for (const adresse of adresses) {
    if (mapping.has(adresse.libelle_normalise)) {
      const numero = Number.parseInt(adresse.numero, 10)
      const isPair = numero % 2 === 0
      const matchingCollege = carteGroups[mapping.get(adresse.libelle_normalise)]
        .find(c => c.n_de_voie_debut <= numero && c.n_de_voie_fin >= numero && ['PI', isPair ? 'P' : 'I'].includes(c.parite))

      if (matchingCollege) {
        adressesFeatures.push({
          type: 'Feature',
          properties: {
            codeRNE: matchingCollege.code_rne
          },
          geometry: {
            type: 'Point',
            coordinates: [Number.parseFloat(adresse.long), Number.parseFloat(adresse.lat)]
          }
        })
      }
    }
  }

  const ratio = adressesFeatures.length / adresses.length
  const ratioOk = ratio >= 0.7
  const ratioText = ratioOk
    ? chalk.greenBright((ratio * 100).toFixed(0) + '%')
    : chalk.redBright((ratio * 100).toFixed(0) + '%')

  console.log(`${codeCommune} | Adresses totales : ${adresses.length} - Adresses trouvées : ${adressesFeatures.length} | Ratio : ${ratioText}`)

  if (!ratioOk) {
    return
  }

  const contourCommune = await getContour(codeCommune)
  const bboxCommune = bbox(contourCommune)

  const voronoiFeatures = voronoi(featureCollection(adressesFeatures), bboxCommune).features

  return dissolve(featureCollection(voronoiFeatures), {propertyName: 'codeRNE'})
    .features
    .map(f => intersect(f, contourCommune, {properties: f.properties}))
    .map(f => {
      if (f?.properties) {
        f.properties = colleges[f.properties.codeRNE] || f.properties
        return f
      }

      return null
    })
}
