/* eslint import/no-unassigned-import: off */
/* eslint unicorn/prefer-top-level-await: off */
import 'dotenv/config.js'

import process from 'node:process'
import morgan from 'morgan'
import express from 'express'
import createError from 'http-errors'
import next from 'next'

import w from './lib/util/w.js'
import errorHandler from './lib/util/error-handler.js'
import {validateCoordinates} from './lib/util/validate.js'

import {search} from './lib/search.js'

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (process.env.NODE_ENV !== 'production') {
    server.use(morgan('dev'))
  }

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
