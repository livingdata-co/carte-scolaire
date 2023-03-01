import {readFile} from 'node:fs/promises'
import Flatbush from 'flatbush'
import {booleanPointInPolygon, point} from '@turf/turf'
import LMDB from 'lmdb'
import Pbf from 'pbf'
import geobuf from 'geobuf'

const distPath = new URL('../dist/', import.meta.url)

const collegesFilePath = new URL('colleges.geojson', distPath)
const datasetText = await readFile(collegesFilePath, {encoding: 'utf8'})
const collegesFeatures = JSON.parse(datasetText).features

const collegesIndex = new Map()

for (const feature of collegesFeatures) {
  const {codeRNE} = feature.properties
  collegesIndex.set(codeRNE, feature)
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

export function getCollege(codeRNE) {
  return collegesIndex.get(codeRNE)
}

export function closeDb() {
  lmdb.close()
}
