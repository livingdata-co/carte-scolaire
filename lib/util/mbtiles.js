/* eslint no-new: off */
import MBTiles from '@mapbox/mbtiles'

const tilesPath = new URL('../../carte-scolaire.mbtiles?mode=ro', import.meta.url)
const db = await getLoadedDatabase(tilesPath)

function getLoadedDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    new MBTiles(dbPath, (err, loadedDb) => {
      if (err) {
        return reject(err)
      }

      resolve(loadedDb)
    })
  })
}

export function getTile(z, x, y) {
  return new Promise((resolve, reject) => {
    db.getTile(z, x, y, (err, data, headers) => {
      if (err) {
        return reject(err)
      }

      resolve({data, headers})
    })
  })
}
