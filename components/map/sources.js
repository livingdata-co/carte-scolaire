/* eslint n/prefer-global/process: off */

const tilesURL = new URL('/tiles', window.location.href) // eslint-disable-line no-undef

export const sources = [
  {
    id: 'secteurs',
    options: {
      type: 'vector',
      promoteId: 'codeRNE',
      tiles: [`${tilesURL}/{z}/{x}/{y}`],
      maxzoom: 12,
      minzoom: 8
    }
  }
]
