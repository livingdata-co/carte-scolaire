import {readFile} from 'node:fs/promises'
import {keyBy} from 'lodash-es'

async function getCommunesData() {
  const fileData = await readFile(new URL('../node_modules/@etalab/decoupage-administratif/data/communes.json', import.meta.url), {encoding: 'utf8'})
  return JSON.parse(fileData)
    .filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))
}

const communes = await getCommunesData()
const communesIndex = keyBy(communes, 'code')

export function getCommunes() {
  return communes
}

export function getCommune(codeCommune) {
  return communesIndex[codeCommune]
}

export function communeFiltered(codeCommune) {
  return codeCommune.slice(0, 2) >= '98' || codeCommune.slice(0, 3) >= '977' || codeCommune.startsWith('975')
}
