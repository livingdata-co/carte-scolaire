#!/usr/bin/env node
import {writeFile, mkdir} from 'node:fs/promises'
import got from 'got'

const sourcesPath = new URL('sources/', import.meta.url)

await mkdir(sourcesPath)

const CARTE_SCOLAIRE_DATASET_URL = 'https://data.education.gouv.fr/explore/dataset/fr-en-carte-scolaire-colleges-publics/download?format=json&timezone=Europe/Berlin&use_labels_for_header=false'

const data = await got(CARTE_SCOLAIRE_DATASET_URL).buffer()
await writeFile(new URL('carte-scolaire.json', sourcesPath), data)
