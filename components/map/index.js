import {useEffect, useRef, useState} from 'react'
import maplibregl from 'maplibre-gl'

import {sources} from '@/components/map/sources.js'
import {layers} from '@/components/map/layers.js'

const Map = () => {
  const mapContainer = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    const maplibre = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      center: [1.7, 46.9],
      zoom: 4
    })

    maplibre.once('load', () => {
      maplibre.addControl(new maplibregl.NavigationControl({showCompass: false}))

      for (const source of sources) {
        maplibre.addSource(source.id, source.options)
      }

      for (const layer of layers) {
        maplibre.addLayer(layer)
      }
    })

    setMap(maplibre)

    return () => {
      maplibre.remove()
    }
  }, [])

  useEffect(() => {
    if (map) {
      console.log('Map is loaded')
    }
  },[map])

  return (
    <div ref={mapContainer} style={{width: '100%', height: '100%'}} />
  )
}

export default Map
