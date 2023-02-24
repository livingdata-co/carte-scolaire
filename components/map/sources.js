export const sources = [
  {
    id: 'decoupage-administratif',
    options: {
      type: 'vector',
      promoteId: 'gid',
      format: 'pbf',
      tiles: [
        'https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif/{z}/{x}/{y}.pbf'
      ]
    }
  }
]
