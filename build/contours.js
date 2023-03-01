import got from 'got'

export async function getContour(codeCommune) {
  return got(`https://geo.api.gouv.fr/communes/${codeCommune}?format=geojson&geometry=contour`).json()
}
