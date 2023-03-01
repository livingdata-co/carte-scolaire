import {Buffer} from 'node:buffer'
import {Transform} from 'node:stream'
import {createReadStream} from 'node:fs'
import Flatbush from 'flatbush'
import JSONStream from 'JSONStream'
import {bbox} from '@turf/turf'
import LMDB from 'lmdb'
import Pbf from 'pbf'
import geobuf from 'geobuf'

const lmdb = LMDB.open({
  path: '../secteurs.db'
})

await lmdb.clearAsync()

const fileStream = createReadStream(new URL('../dist/secteurs.geojson', import.meta.url))

function createParser(jsonPath) {
  const parser = JSONStream.parse(jsonPath)
  const items = []
  let ended = false

  parser.on('data', item => items.push(item))
  parser.on('end', () => {
    ended = true
  })

  return new Transform({
    transform(chunk, enc, cb) {
      parser.write(chunk)

      while (items.length > 0) {
        this.push(items.shift())
      }

      cb()
    },

    flush(cb) {
      parser.end()

      while (items.length > 0) {
        this.push(items.shift())
      }

      if (items.length > 0 || !ended) {
        cb(new Error('JSON parser error'))
      }

      cb()
    },

    objectMode: true
  })
}

const stream = fileStream.pipe(createParser('features.*'))

let idx = 0
const bboxes = []

for await (const feature of stream) {
  const featureBbox = bbox(feature)
  const buffer = geobuf.encode(feature, new Pbf())
  await lmdb.put(idx, LMDB.asBinary(buffer))
  bboxes.push(featureBbox)
  idx++
  if (idx % 100 === 0) {
    console.log(idx)
  }
}

const index = new Flatbush(bboxes.length)

for (const bbox of bboxes) {
  index.add(...bbox)
}

index.finish()

await lmdb.put(999_999, LMDB.asBinary(Buffer.from(index.data)))
