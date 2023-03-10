#!/usr/bin/env
/* eslint no-await-in-loop: off */

import {createWriteStream} from 'node:fs'
import {readFile, writeFile} from 'node:fs/promises'
import {finished} from 'node:stream/promises'
import {groupBy, keyBy} from 'lodash-es'
import JSONStream from 'JSONStream'
import pumpify from 'pumpify'
import {featureCollection, feature} from '@turf/turf'
import {getCommune, getCommunes, communeFiltered} from '../build/cog.js'
import {buildCarteSecteurFeatures} from '../build/carte-secteur.js'
import {getContour} from '../build/contours.js'
import {fileExists} from '../build/fs.js'

const communesActuelles = await getCommunes()

async function getIndexedColleges() {
  const datasetText = await readFile(new URL('../dist/colleges.geojson', import.meta.url), {encoding: 'utf8'})
  const {features} = JSON.parse(datasetText)
  const colleges = features.map(({properties}) => properties)
  return keyBy(colleges, 'codeRNE')
}

async function readCarteScolaireRows() {
  const datasetText = await readFile(new URL('../sources/carte-scolaire.json', import.meta.url), {encoding: 'utf8'})
  return JSON.parse(datasetText).map(r => r.fields)
}

const carteScolaireRows = await readCarteScolaireRows()
const colleges = await getIndexedColleges()

const communesRows = groupBy(carteScolaireRows, 'code_insee')

const communesFeaturesWriteStream = createWriteStream(new URL('../dist/secteurs.geojson', import.meta.url))
const communesFeaturesStream = pumpify.obj(
  JSONStream.stringify(
    '{"type":"FeatureCollection","features":[',
    '\n,\n',
    ']}'
  ),
  communesFeaturesWriteStream
)

for (const commune of communesActuelles) {
  const {code: codeCommune} = commune

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
      erreur: 'Donn??es non disponibles sur cette commune'
    })
    continue
  }

  if (communeRows.length > 1) {
    const carteSecteurFeatures = await buildCarteSecteurFeatures(
      codeCommune,
      communeRows
    )

    if (carteSecteurFeatures) {
      await writeCommuneFeatures(
        codeCommune,
        carteSecteurFeatures
      )
    } else {
      await writeWholeCommuneFeature(codeCommune, {
        erreur: 'Impossible de cr??er la carte scolaire de la commune'
      })
    }
  } else {
    await writeWholeCommuneFeature(codeCommune, {
      codeRNE: communeRows[0].code_rne
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

  for (const f of features) {
    f.properties.codeCommune = codeCommune
    f.properties.nomCommune = getCommune(codeCommune).nom

    if (f.properties.codeRNE) {
      const college = colleges[f.properties.codeRNE] || {}
      f.properties = {...f.properties, ...college}
    }
  }

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
  return new URL(`../dist/secteur-${codeCommune}.json`, import.meta.url)
}
