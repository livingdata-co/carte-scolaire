#!/usr/bin/env node
import {writeFile, mkdir} from 'node:fs/promises'
import got from 'got'

const sourcesPath = new URL('sources/', import.meta.url)
const adressesSourcesPath = new URL('sources/adresses/', import.meta.url)

await mkdir(adressesSourcesPath, {recursive: true})

const CARTE_SCOLAIRE_DATASET_URL = 'https://data.education.gouv.fr/explore/dataset/fr-en-carte-scolaire-colleges-publics/download?format=json&timezone=Europe/Berlin&use_labels_for_header=false'

const carteScolaireData = await got(CARTE_SCOLAIRE_DATASET_URL).buffer()
await writeFile(new URL('carte-scolaire.json', sourcesPath), carteScolaireData)

const ETABLISSEMENTS_DATASET_URL = 'https://data.education.gouv.fr/explore/dataset/fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre/download?format=json&timezone=Europe/Berlin'

const etablissementsData = await got(ETABLISSEMENTS_DATASET_URL).buffer()
await writeFile(new URL('etablissements.json', sourcesPath), etablissementsData)
