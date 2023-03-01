/* eslint n/prefer-global/process: off */

const API_ADRESSE = process.env.NEXT_PUBLIC_API_ADRESSE || 'https://api-adresse.data.gouv.fr'
const API_ITINERAIRE = process.env.NEXT_PUBLIC_API_ITINERAIRE || 'https://wxs.ign.fr/calcul/geoportail/itineraire/rest/1.0.0/route'

async function _fetch(url) {
  const options = {
    mode: url.startsWith('http') ? 'cors' : 'same-origin',
    method: 'GET'
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    const error = await response.json()

    if (error.error) {
      throw new Error(error.error.message) // Error response when fetching itineraire
    }

    throw new Error(error.message)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export function isFirstCharValid(string) {
  return (string.slice(0, 1).toLowerCase() !== string.slice(0, 1).toUpperCase()) || (string.codePointAt(0) >= 48 && string.codePointAt(0) <= 57)
}

export function search(args) {
  const {q, limit} = args
  let url = `${API_ADRESSE}/search/?q=${encodeURIComponent(q)}`

  if (limit) {
    url += `&limit=${limit}`
  }

  return _fetch(url)
}

export function secteur([lon, lat]) {
  return _fetch(`/secteur/?lon=${lon}&lat=${lat}`)
}

export function getCollege(codeRNE) {
  return _fetch(`/colleges/${codeRNE}`)
}

export function getCollegeItineraire(args) {
  const {start, end, distanceUnit, timeUnit} = args

  let url = `${API_ITINERAIRE}?start=${encodeURIComponent(start.join(','))}&end=${encodeURIComponent(end.join(','))}&resource=bdtopo-osrm`

  if (distanceUnit) {
    url += `&distanceUnit=${distanceUnit}`
  }

  if (timeUnit) {
    url += `&timeUnit=${timeUnit}`
  }

  return _fetch(url)
}
