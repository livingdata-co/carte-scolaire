import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'

import {sources} from '@/components/map/sources.js'
import {layers} from '@/components/map/layers.js'
import colors from '@/styles/colors.js'

const itineraireLayer = {
  id: 'itineraire-line',
  type: 'line',
  source: 'itineraire',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': colors.darkGrey,
    'line-width': 4
  }
}

const Map = ({selectedAdresse, collegeFeature, collegeItineraire, isMobileDevice}) => {
  const mapContainer = useRef(null)
  const adresseMarker = useRef(null)
  const adressePopup = useRef(null)
  const collegeMarker = useRef(null)
  const collegePopup = useRef(null)
  const sourcesLoaded = useRef(false)
  const layersLoaded = useRef(false)
  const map = useRef(null)

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

    map.current = maplibre

    return () => {
      maplibre.remove()
    }
  }, [])

  useEffect(() => {
    if (selectedAdresse && collegeFeature && map?.current) {
      const adressePosition = selectedAdresse.geometry.coordinates

      const adresseMarkerElement = document.createElement('div') // eslint-disable-line no-undef
      const collegeMarkerElement = document.createElement('div') // eslint-disable-line no-undef

      const currentAdressePopup = new maplibregl.Popup({offset: 25, closeOnClick: false, closeButton: false})
        .setLngLat(adressePosition)
        .setText(selectedAdresse.properties.label)
        .addTo(map.current)

      const currentAdresseMarker = new maplibregl.Marker(adresseMarkerElement)
        .setLngLat(adressePosition)
        .addTo(map.current)

      const currentCollegePopup = new maplibregl.Popup({offset: 25, closeOnClick: false, closeButton: false})
        .setLngLat(collegeFeature.geometry.coordinates)
        .setText(collegeFeature.properties.nom)
        .addTo(map.current)

      const currentCollegeMarker = new maplibregl.Marker(collegeMarkerElement)
        .setLngLat(collegeFeature.geometry.coordinates)
        .addTo(map.current)

      currentAdresseMarker.getElement().innerHTML = '<img src="/images/map/home.svg">'
      currentCollegeMarker.getElement().innerHTML = '<img src="/images/map/pen.svg">'

      adresseMarker.current = currentAdresseMarker
      adressePopup.current = currentAdressePopup
      collegeMarker.current = currentCollegeMarker
      collegePopup.current = currentCollegePopup

      map.current.fitBounds([
        adressePosition,
        collegeFeature.geometry.coordinates
      ], {padding: isMobileDevice ? 120 : 200})
    }

    return () => {
      if (adresseMarker.current) {
        adresseMarker.current.remove()
      }

      if (adressePopup.current) {
        adressePopup.current.remove()
      }

      if (collegeMarker.current) {
        collegeMarker.current.remove()
      }

      if (collegePopup.current) {
        collegePopup.current.remove()
      }
    }
  }, [selectedAdresse, collegeFeature, map, isMobileDevice])

  useEffect(() => {
    if (!collegeItineraire) {
      return
    }

    if (!sourcesLoaded.current) {
      map.current.addSource('itineraire', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: collegeItineraire.geometry
        }
      })

      sourcesLoaded.current = true
    }

    if (!layersLoaded.current) {
      map.current.addLayer(itineraireLayer)

      layersLoaded.current = true
    }

    map.current.getSource('itineraire').setData({
      type: 'Feature',
      geometry: collegeItineraire?.geometry
    })
  }, [collegeItineraire])

  return (
    <div ref={mapContainer} style={{width: '100%', height: '100%'}} />
  )
}

Map.propTypes = {
  selectedAdresse: PropTypes.object,
  collegeFeature: PropTypes.object,
  collegeItineraire: PropTypes.object,
  isMobileDevice: PropTypes.bool
}

Map.defaultProps = {
  selectedAdresse: null,
  collegeFeature: null,
  collegeItineraire: null,
  isMobileDevice: false
}

export default Map
