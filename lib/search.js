import {readFile} from 'node:fs/promises'
import Flatbush from 'flatbush'
import {booleanPointInPolygon, point} from '@turf/turf'
import LMDB from 'lmdb'
import Pbf from 'pbf'
import geobuf from 'geobuf'
import createError from 'http-errors'

const distPath = new URL('../dist/', import.meta.url)
const collegesFilePath = new URL('colleges.geojson', distPath)

const datasetText = await readFile(collegesFilePath, {encoding: 'utf8'})
const collegesFeatures = JSON.parse(datasetText).features
const collegePosition = new Map()

for (const feature of collegesFeatures) {
  collegePosition.set(feature.properties.codeRNE, feature.geometry.coordinates)
}

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

export function getCollegePosition(codeRNE) {
  const positions = collegePosition.get(codeRNE)

  if (!positions) {
    throw createError(404, 'Collège introuvable')
  }

  return positions
}

export function closeDb() {
  lmdb.close()
}
