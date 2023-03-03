import colors from '@/styles/colors.js'

export const layers = [
  {
    id: 'secteurs-lines',
    source: 'secteurs',
    'source-layer': 'secteurs',
    type: 'line',
    paint: {
      'line-color': colors.darkGrey,
      'line-width': 1
    },
    layout: {
      visibility: 'none'
    }
  },
  {
    id: 'secteurs-fill',
    source: 'secteurs',
    'source-layer': 'secteurs',
    type: 'fill',
    paint: {
      'fill-color': colors.blue,
      'fill-opacity': 0.1
    },
    layout: {
      visibility: 'none'
    }
  },
  {
    id: 'colleges',
    source: 'secteurs',
    'source-layer': 'colleges',
    type: 'circle',
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        colors.blue,
        colors.green
      ],
      'circle-radius': 10
    },
    filter: [
      'all',
      ['==', 'secteur', 'Public'],
      ['!has', 'erreur']
    ]
  }
]
