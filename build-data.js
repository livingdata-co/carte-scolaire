import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {featureCollection} from '@turf/turf'
import {buildCarteSecteurFeatures} from './lib/build-carte-secteur-features.js'

const distPath = new URL('dist/', import.meta.url)

await mkdir(distPath, {recursive: true})

const datasetText = await readFile(new URL('sources/carte-scolaire.json', import.meta.url), {encoding: 'utf8'})
const dataset = JSON.parse(datasetText).map(r => r.fields)

const carteSecteurFeatures = await buildCarteSecteurFeatures('57463', dataset.filter(r => r.code_insee === '57463'))

await writeFile(
  new URL('carte-scolaire-metz.json', distPath),
  JSON.stringify(featureCollection(carteSecteurFeatures))
)
