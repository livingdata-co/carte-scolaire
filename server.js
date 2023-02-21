/* eslint import/no-unassigned-import: off */
import 'dotenv/config.js'

import process from 'node:process'
import morgan from 'morgan'
import express from 'express'
import createError from 'http-errors'

import w from './lib/util/w.js'
import errorHandler from './lib/util/error-handler.js'
import {validateCoordinates} from './lib/util/validate.js'

import {search} from './lib/search.js'

const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/secteur', w(async (req, res) => {
  const lon = Number.parseFloat(req.query.lon)
  const lat = Number.parseFloat(req.query.lat)

  const coordinates = validateCoordinates([lon, lat])
  const college = search(coordinates)

  const erreur = college?.properties?.erreur

  if (!college) {
    throw createError(404, 'Territoire non couvert')
  }

  if (erreur) {
    throw createError(400, erreur)
  }

  res.send(college)
}))

app.use(errorHandler)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Start listening on port ${port}`)
})
