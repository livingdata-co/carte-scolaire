export const layers = [
  {
    id: 'departements-layer',
    type: 'line',
    source: 'decoupage-administratif',
    'source-layer': 'departements',
    paint: {
      'line-color': '#666666',
      'line-width': 0.1
    }
  },
  {
    id: 'communes-line',
    type: 'line',
    source: 'decoupage-administratif',
    'source-layer': 'communes',
    paint: {
      'line-color': '#D1D3BD',
      'line-width': 1
    }
  }
]
