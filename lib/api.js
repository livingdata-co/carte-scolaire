/* eslint n/prefer-global/process: off */

const API_ADRESSE = process.env.NEXT_PUBLIC_API_ADRESSE || 'https://api-adresse.data.gouv.fr'

async function _fetch(url) {
  const options = {
    mode: url.startsWith('http') ? 'cors' : 'same-origin',
    method: 'GET'
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    const error = await response.json()
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
