#!/usr/bin/env
/* eslint no-await-in-loop: off */

import {readFile, writeFile, mkdir} from 'node:fs/promises'
import {featureCollection} from '@turf/turf'

import {communeFiltered} from './lib/cog.js'

const sourcesPath = new URL('sources/', import.meta.url)
const distPath = new URL('dist/', import.meta.url)
const collegesFilePath = new URL('colleges.geojson', distPath)

await mkdir(distPath, {recursive: true})

async function readEtablissementRows() {
  const datasetText = await readFile(new URL('etablissements.json', sourcesPath), {encoding: 'utf8'})
  return JSON.parse(datasetText).map(r => r.fields)
}

const etablissements = await readEtablissementRows()

const features = etablissements.filter(etablissement =>
  etablissement.etat_etablissement_libe === 'OUVERT'
  && etablissement.nature_uai_libe === 'COLLEGE'
  && !communeFiltered(etablissement.code_commune)
  && etablissement.longitude && etablissement.latitude)
  .map(college => {
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
      codeCommuneEtablissement: college.code_commune,
      nomCommuneEtablissement: college.libelle_commune,
      adresseEtablissement: college.adresse_uai
    }

    return {
      type: 'Feature',
      geometry,
      properties
    }
  })

await writeFile(
  collegesFilePath,
  JSON.stringify(featureCollection(features))
)
