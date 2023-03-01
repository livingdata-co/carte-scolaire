import {polygon, featureCollection, collectionOf} from '@turf/turf'
import {Delaunay} from 'd3-delaunay'
import {uniqBy} from 'lodash-es'

function voronoi(points, bbox) {
  // Input Validation
  if (!points) {
    throw new Error('points is required')
  }

  if (!Array.isArray(bbox)) {
    throw new TypeError('bbox is invalid')
  }

  collectionOf(points, 'Point', 'points')

  // Deduping points in advance since Delaunator will
  const dedupedPoints = uniqBy(
    points.features,
    f => `${f.geometry.coordinates[0].toFixed(5)}@@${f.geometry.coordinates[1].toFixed(5)}`
  )

  const voronoiDiagram = Delaunay
    .from(dedupedPoints, f => f.geometry.coordinates[0] * 10_000, f => f.geometry.coordinates[1] * 10_000) // Coordinates are multiplied to avoid round issues
    .voronoi(bbox.map(c => c * 10_000)) // Coordinates are multiplied to avoid round issues

  // Main
  return featureCollection(
    [...voronoiDiagram.cellPolygons()]
      .map((cellPolygon, i) => {
        const coords = cellPolygon.map(pt => pt.map(c => c / 10_000)) // Division to fallback to regular coordinates
        coords.push(coords[0])
        return polygon([coords], dedupedPoints[i].properties)
      })
  )
}

export default voronoi
