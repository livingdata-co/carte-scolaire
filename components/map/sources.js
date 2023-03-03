/* eslint n/prefer-global/process: off */

const TILES_URL = process.env.NEXT_PUBLIC_TILES_URL || 'http://localhost:3000'

export const sources = [
  {
    id: 'secteurs',
    options: {
      type: 'vector',
      promoteId: 'codeRNE',
      tiles: [`${TILES_URL}/tiles/{z}/{x}/{y}`],
      maxzoom: 12,
      minzoom: 8
    }
  }
]
