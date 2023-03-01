#!/usr/bin/env node
import {downloadTo} from './lib/util/download.js'

console.log('  * Téléchargement de carte-scolaire.json')

await downloadTo(
  'https://data.education.gouv.fr/explore/dataset/fr-en-carte-scolaire-colleges-publics/download?format=json&timezone=Europe/Berlin&use_labels_for_header=false',
  './sources/carte-scolaire.json',
  import.meta.url
)

console.log('  * Téléchargement de etablissements.json')

await downloadTo(
  'https://data.education.gouv.fr/explore/dataset/fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre/download?format=json&timezone=Europe/Berlin',
  'etablissements.json',
  import.meta.url
)
