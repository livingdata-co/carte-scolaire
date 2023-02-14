#!/usr/bin/env
/* eslint no-await-in-loop: off */

import {mkdir, readFile, writeFile, access} from 'node:fs/promises'
import {groupBy} from 'lodash-es'
import {featureCollection, feature} from '@turf/turf'
import {buildCarteSecteurFeatures} from './lib/carte-secteur.js'
import {getContour} from './lib/contours.js'

const distPath = new URL('dist/', import.meta.url)

await mkdir(distPath, {recursive: true})

async function readCarteScolaireRows() {
  const datasetText = await readFile(new URL('sources/carte-scolaire.json', import.meta.url), {encoding: 'utf8'})
  return JSON.parse(datasetText).map(r => r.fields)
}

function communeFiltered(codeCommune) {
  return codeCommune.slice(0, 2) >= '98' || codeCommune.slice(0, 3) >= '977' || codeCommune.startsWith('975')
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const carteScolaireRows = await readCarteScolaireRows()

const communesRows = groupBy(carteScolaireRows, 'code_insee')

for (const codeCommune of Object.keys(communesRows)) {
  if (communeFiltered(codeCommune)) {
    continue
  }

  const filePath = new URL(`secteur-${codeCommune}.json`, distPath)

  if (await fileExists(filePath)) {
    continue
  }

  const communeRows = communesRows[codeCommune]

  if (communeRows.length > 1) {
    const carteSecteurFeatures = await buildCarteSecteurFeatures(
      codeCommune,
      communeRows
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
    await writeWholeCommuneFeature(codeCommune, filePath, {
      codeRNE: communeRows[0].code_rne
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
