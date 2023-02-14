import {readFile} from 'node:fs/promises'

export async function getCommunes() {
  const fileData = await readFile(new URL('../node_modules/@etalab/decoupage-administratif/data/communes.json', import.meta.url), {encoding: 'utf8'})
  return JSON.parse(fileData)
}
