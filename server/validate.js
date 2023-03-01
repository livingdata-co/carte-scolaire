import createError from 'http-errors'

export function validateCoordinates([lon, lat]) {
  if (Number.isNaN(lon) || lon <= -180 || lon >= 180 || Number.isNaN(lat) || lat <= -90 || lat >= 90) {
    throw createError(400, 'lon/lat doivent être des coordonnées WGS-84 valides.')
  }

  return [lon, lat]
}
