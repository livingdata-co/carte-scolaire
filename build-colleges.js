#!/usr/bin/env
/* eslint no-await-in-loop: off */

import {readFile, writeFile, mkdir, access} from 'node:fs/promises'
import got from 'got'
import {featureCollection} from '@turf/turf'

import {communeFiltered} from './lib/cog.js'

const sourcesPath = new URL('sources/', import.meta.url)
const distPath = new URL('dist/', import.meta.url)
const collegesFilePath = new URL('colleges.geojson', distPath)

await mkdir(sourcesPath, {recursive: true})
await mkdir(distPath, {recursive: true})

const ETABLISSEMENTS_DATASET_URL = 'https://data.education.gouv.fr/explore/dataset/fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre/download?format=json&timezone=Europe/Berlin'

const data = await got(ETABLISSEMENTS_DATASET_URL).buffer()
await writeFile(new URL('etablissements.json', sourcesPath), data)

async function readEtablissementRows() {
  const datasetText = await readFile(new URL('sources/etablissements.json', import.meta.url), {encoding: 'utf8'})
  return JSON.parse(datasetText).map(r => r.fields)
}

const etablissements = await readEtablissementRows()

function getColleges() {
  return etablissements.filter(etablissement => etablissement.etat_etablissement_libe === 'OUVERT' && etablissement.nature_uai_libe === 'COLLEGE' && !communeFiltered(etablissement.code_commune))
}

const colleges = getColleges()

async function collegesFileExists() {
  try {
    await access(collegesFilePath)
    return true
  } catch {
    return false
  }
}

function buildCollegesFeatures() {
  collegesFileExists()

  return colleges.map(college => {
    const geometry = {
      type: 'Point',
      coordinates: [
        college.longitude,
        college.latitude
      ]
    }

    const properties = {
      codeRNE: college.numero_uai,
      nom: college.appellation_officielle,
      secteur: college.secteur_public_prive_libe,
      codeCommune: college.code_commune,
      nomCommune: college.libelle_commune
    }

    return {
      type: 'Feature',
      geometry,
      properties
    }
  })
}

const features = buildCollegesFeatures()

await writeFile(
  collegesFilePath,
  JSON.stringify(featureCollection(features))
)
