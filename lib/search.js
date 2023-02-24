import {readFile} from 'node:fs/promises'
import Flatbush from 'flatbush'
import {booleanPointInPolygon, point} from '@turf/turf'
import LMDB from 'lmdb'
import Pbf from 'pbf'
import geobuf from 'geobuf'
import createError from 'http-errors'

const distPath = new URL('../dist/', import.meta.url)
const collegesFilePath = new URL('colleges.geojson', distPath)

const lmdb = LMDB.open({
  path: 'secteurs.db',
  readOnly: true
})

const indexDataView = lmdb.getBinary(999_999)
const indexData = indexDataView.buffer.slice(
  indexDataView.byteOffset,
  indexDataView.byteOffset + indexDataView.byteLength
)

const index = Flatbush.from(indexData)

export function search([lon, lat]) {
  const indexResults = index.search(lon, lat, lon, lat)
  const candidates = indexResults.map(r => {
    const buffer = lmdb.getBinary(r)
    return geobuf.decode(new Pbf(buffer))
  })

  return candidates.find(c => booleanPointInPolygon(point([lon, lat]), c))
}

export async function getCollegePosition(codeRNE) {
  const datasetText = await readFile(collegesFilePath, {encoding: 'utf8'})
  const feature = JSON.parse(datasetText).features.find(f => f.properties.codeRNE === codeRNE)

  if (!feature) {
    throw createError(404, 'Collège introuvable')
  }

  return feature.geometry.coordinates
}

export function closeDb() {
  lmdb.close()
}
