/* eslint camelcase: off */
import Papa from 'papaparse'
import got from 'got'
import {chain, memoize, groupBy} from 'lodash-es'
import adressesUtils from '@ban-team/adresses-util'
import leven from 'leven'
import {bbox, voronoi, featureCollection, dissolve, intersect} from '@turf/turf'

export async function buildCarteSecteurFeatures(codeCommune, rows) {
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

  const banData = await got(`https://plateforme.adresse.data.gouv.fr/ban/communes/${codeCommune}/download/csv-bal/adresses`).text()
  const {data: adresses} = Papa.parse(banData, {delimiter: ';', header: true})

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

  const contourCommune = await got(`https://geo.api.gouv.fr/communes/${codeCommune}?format=geojson&geometry=contour`).json()
  const bboxCommune = bbox(contourCommune)

  const {features: voronoiAdressesFeatures} = voronoi(
    featureCollection(adressesFeatures),
    {bbox: bboxCommune}
  )

  for (const [i, feature] of voronoiAdressesFeatures.entries()) {
    feature.properties = {
      codeRNE: adressesFeatures[i].properties.codeRNE
    }
  }

  return dissolve(featureCollection(voronoiAdressesFeatures), {propertyName: 'codeRNE'})
    .features
    .map(f => intersect(f, contourCommune, {properties: f.properties}))
}
