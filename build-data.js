#!/usr/bin/env
/* eslint no-await-in-loop: off */

import {readFile, writeFile, access} from 'node:fs/promises'
import {groupBy} from 'lodash-es'
import {featureCollection, feature} from '@turf/turf'
import {getCommunes, communeFiltered} from './lib/cog.js'
import {buildCarteSecteurFeatures} from './lib/carte-secteur.js'
import {getContour} from './lib/contours.js'

const distPath = new URL('dist/', import.meta.url)

const communes = await getCommunes()
const communesActuelles = communes.filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))

async function getCollegesProperties() {
  const datasetText = await readFile(new URL('dist/colleges.geojson', import.meta.url), {encoding: 'utf8'})
  const {features} = JSON.parse(datasetText)
  return features.map(({properties}) => properties)
}

async function readCarteScolaireRows() {
  const datasetText = await readFile(new URL('sources/carte-scolaire.json', import.meta.url), {encoding: 'utf8'})
  return JSON.parse(datasetText).map(r => r.fields)
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const collegesProperties = await getCollegesProperties()
const carteScolaireRows = await readCarteScolaireRows()

const communesRows = groupBy(carteScolaireRows, 'code_insee')
const colleges = groupBy(collegesProperties, 'codeRNE')

for (const commune of communesActuelles) {
  const {code: codeCommune} = commune

  if (communeFiltered(codeCommune)) {
    continue
  }

  const filePath = new URL(`secteur-${codeCommune}.json`, distPath)

  if (await fileExists(filePath)) {
    continue
  }

  const communeRows = communesRows[codeCommune]

  if (!communeRows) {
    await writeWholeCommuneFeature(codeCommune, filePath, {
      erreur: 'Données non disponibles sur cette commune'
    })
    continue
  }

  if (communeRows.length > 1) {
    const carteSecteurFeatures = await buildCarteSecteurFeatures(
      codeCommune,
      communeRows,
      colleges
    )

    if (carteSecteurFeatures) {
      await writeFile(
        filePath,
        JSON.stringify(featureCollection(carteSecteurFeatures))
      )
    } else {
      await writeWholeCommuneFeature(codeCommune, filePath, {
        erreur: 'Impossible de créer la carte scolaire de la commune'
      })
    }
  } else {
    const codeRNE = communeRows[0].code_rne
    const college = colleges[codeRNE]

    await writeWholeCommuneFeature(codeCommune, filePath, {
      codeRNE,
      ...college[0]
    })
  }
}

async function writeWholeCommuneFeature(codeCommune, filePath, properties) {
  const contour = await getContour(codeCommune)
  await writeFile(
    filePath,
    JSON.stringify(featureCollection([feature(contour.geometry, properties)]))
  )
}
