/* eslint import/no-unassigned-import: off */
/* eslint unicorn/prefer-top-level-await: off */
import 'dotenv/config.js'

import process from 'node:process'
import morgan from 'morgan'
import express from 'express'
import createError from 'http-errors'
import cors from 'cors'
import next from 'next'

import w from './lib/util/w.js'
import errorHandler from './lib/util/error-handler.js'
import {validateCoordinates} from './lib/util/validate.js'
import {getTile} from './lib/util/mbtiles.js'

import {search} from './lib/search.js'

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (process.env.NODE_ENV !== 'production') {
    server.use(morgan('dev'))
  }

  server.use(cors({origin: true}))

  server.get('/tiles/:z/:x/:y', w(async (req, res) => {
    try {
      const tile = await getTile(req.params.z, req.params.x, req.params.y)
      res.set('Content-Encoding', 'gzip')
      res.set('Content-Type', 'application/x-protobuf')
      res.set(tile.headers)
      res.send(tile.data)
    } catch (error) {
      if (error.message === 'Tile does not exist') {
        return res.sendStatus(404)
      }

      throw error
    }
  }))

  server.get('/secteur', w(async (req, res) => {
    const lon = Number.parseFloat(req.query.lon)
    const lat = Number.parseFloat(req.query.lat)

    const coordinates = validateCoordinates([lon, lat])
    const college = search(coordinates)

    if (!college) {
      throw createError(404, 'Territoire non couvert')
    }

    res.send(college)
  }))

  server.get('*', (req, res) => handle(req, res))

  server.use(errorHandler)

  const port = process.env.PORT || 3000

  server.listen(port, () => {
    console.log(`Start listening on port ${port}`)
  })
})
