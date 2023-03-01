#!/usr/bin/env node
import {downloadTo} from './lib/util/download.js'

console.log('  * Téléchargement de colleges.geojson')

await downloadTo(
  'https://carte-scolaire-data.s3.fr-par.scw.cloud/colleges.geojson',
  './dist/colleges.geojson',
  import.meta.url
)

console.log('  * Téléchargement de secteurs.db')

await downloadTo(
  'https://carte-scolaire-data.s3.fr-par.scw.cloud/secteurs.db',
  './secteurs.db',
  import.meta.url
)

console.log('  * Téléchargement de carte-scolaire.mbtiles')

await downloadTo(
  'https://carte-scolaire-data.s3.fr-par.scw.cloud/carte-scolaire.mbtiles',
  './carte-scolaire.mbtiles',
  import.meta.url
)
