#!/usr/bin/env
/* eslint no-await-in-loop: off */

import {createWriteStream} from 'node:fs'
import {readFile, writeFile, access} from 'node:fs/promises'
import {finished} from 'node:stream/promises'
import {groupBy, keyBy} from 'lodash-es'
import JSONStream from 'JSONStream'
import pumpify from 'pumpify'
import {featureCollection, feature} from '@turf/turf'
import {getCommunes, communeFiltered} from './lib/cog.js'
import {buildCarteSecteurFeatures} from './lib/carte-secteur.js'
import {getContour} from './lib/contours.js'

const distPath = new URL('dist/', import.meta.url)

const communes = await getCommunes()
const communesActuelles = communes.filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))

async function getIndexedColleges() {
  const datasetText = await readFile(new URL('dist/colleges.geojson', import.meta.url), {encoding: 'utf8'})
  const {features} = JSON.parse(datasetText)
  const colleges = features.map(({properties}) => properties)
  return keyBy(colleges, 'codeRNE')
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

const carteScolaireRows = await readCarteScolaireRows()
const colleges = await getIndexedColleges()

const communesRows = groupBy(carteScolaireRows, 'code_insee')

const communesFeaturesWriteStream = createWriteStream(new URL('secteurs.geojson', distPath))
const communesFeaturesStream = pumpify.obj(
  JSONStream.stringify(
    '{"type":"FeatureCollection","features":[',
    '\n,\n',
    ']}'
  ),
  communesFeaturesWriteStream
)

for (const commune of communesActuelles) {
  const {code: codeCommune, nom: nomCommune} = commune

  if (communeFiltered(codeCommune)) {
    continue
  }

  if (await fileExists(getCommuneFileUrl(codeCommune))) {
    const fileData = await readFile(getCommuneFileUrl(codeCommune), {encoding: 'utf8'})
    const {features} = JSON.parse(fileData)
    await writeCommuneFeatures(codeCommune, features, false)
    continue
  }

  const communeRows = communesRows[codeCommune]

  if (!communeRows) {
    await writeWholeCommuneFeature(codeCommune, {
      erreur: 'Données non disponibles sur cette commune'
    })
    continue
  }

  if (communeRows.length > 1) {
    const carteSecteurFeatures = await buildCarteSecteurFeatures(
      codeCommune,
      nomCommune,
      communeRows,
      colleges
    )

    if (carteSecteurFeatures) {
      await writeCommuneFeatures(
        codeCommune,
        carteSecteurFeatures
      )
    } else {
      await writeWholeCommuneFeature(codeCommune, {
        erreur: 'Impossible de créer la carte scolaire de la commune'
      })
    }
  } else {
    const codeRNE = communeRows[0].code_rne
    const college = colleges[codeRNE] || {}

    await writeWholeCommuneFeature(codeCommune, {
      nomCommune,
      codeRNE,
      ...college
    })
  }
}

communesFeaturesStream.end()

await finished(communesFeaturesWriteStream)

async function writeWholeCommuneFeature(codeCommune, properties) {
  const contour = await getContour(codeCommune)

  await writeCommuneFeatures(
    codeCommune,
    [feature(contour.geometry, {codeCommune, ...properties})]
  )
}

async function writeCommuneFeatures(codeCommune, features, writeCommuneFile = true) {
  const fileUrl = getCommuneFileUrl(codeCommune)

  if (writeCommuneFile) {
    await writeFile(
      fileUrl,
      JSON.stringify(featureCollection(features))
    )
  }

  for (const feature of features) {
    communesFeaturesStream.write(feature)
  }
}

function getCommuneFileUrl(codeCommune) {
  return new URL(`secteur-${codeCommune}.json`, distPath)
}
