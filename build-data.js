#!/usr/bin/env
/* eslint no-await-in-loop: off */

import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {featureCollection} from '@turf/turf'
import {buildCarteSecteurFeatures} from './lib/carte-secteur.js'

const distPath = new URL('dist/', import.meta.url)

await mkdir(distPath, {recursive: true})

async function readCarteScolaireRows() {
  const datasetText = await readFile(new URL('sources/carte-scolaire.json', import.meta.url), {encoding: 'utf8'})
  return JSON.parse(datasetText).map(r => r.fields)
}

function communeFiltered(codeCommune) {
  return codeCommune.slice(0, 2) >= '98' || codeCommune.slice(0, 3) >= '977' || codeCommune.startsWith('975')
}

const carteScolaireRows = await readCarteScolaireRows()

const codesCommunesSecteurs = [...new Set(
  carteScolaireRows.filter(r => r.secteur_unique === 'N').map(r => r.code_insee)
)]

for (const codeCommune of codesCommunesSecteurs) {
  if (communeFiltered(codeCommune)) {
    continue
  }

  const carteSecteurFeatures = await buildCarteSecteurFeatures(
    codeCommune,
    carteScolaireRows.filter(r => r.code_insee === codeCommune)
  )

  if (!carteSecteurFeatures) {
    continue
  }

  await writeFile(
    new URL(`secteur-${codeCommune}.json`, distPath),
    JSON.stringify(featureCollection(carteSecteurFeatures))
  )
}
