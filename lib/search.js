import Flatbush from 'flatbush'
import {booleanPointInPolygon, point} from '@turf/turf'
import LMDB from 'lmdb'
import Pbf from 'pbf'
import geobuf from 'geobuf'

const lmdb = LMDB.open({
  path: 'secteurs.db'
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
