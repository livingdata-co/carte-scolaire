import {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'

import {sources} from '@/components/map/sources.js'
import {layers} from '@/components/map/layers.js'
import MapError from '@/components/map/map-error.js'

import {getCollege} from '@/lib/api.js'

const Map = ({selectedAdresse, selectedCollege, isMobileDevice}) => {
  const mapContainer = useRef(null)
  const adresseMarker = useRef(null)
  const adressePopup = useRef(null)
  const collegeMarker = useRef(null)
  const collegePopup = useRef(null)
  const prevCollegeFeatureRef = useRef(null)
  const [map, setMap] = useState(null)
  const [collegeFeature, setCollegeFeature] = useState(null)
  const [error, setError] = useState(null)

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

  async function getCoordinates(codeRNE) {
    try {
      const collegeFeature = await getCollege(codeRNE)
      setCollegeFeature(collegeFeature)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    if (selectedCollege) {
      setError(null)

      const {erreur, codeRNE} = selectedCollege.properties

      if (!erreur && codeRNE) {
        getCoordinates(codeRNE)
      } else {
        setCollegeFeature(null)
      }
    }
  }, [selectedCollege])

  useEffect(() => {
    if (selectedAdresse && collegeFeature && map) {
      const adressePosition = selectedAdresse.geometry.coordinates

      const adresseMarkerElement = document.createElement('div') // eslint-disable-line no-undef
      const collegeMarkerElement = document.createElement('div') // eslint-disable-line no-undef

      const currentAdressePopup = new maplibregl.Popup({offset: 25, closeOnClick: false, closeButton: false})
        .setLngLat(adressePosition)
        .setText(selectedAdresse.properties.label)
        .addTo(map)

      const currentAdresseMarker = new maplibregl.Marker(adresseMarkerElement)
        .setLngLat(adressePosition)
        .addTo(map)

      const currentCollegePopup = new maplibregl.Popup({offset: 25, closeOnClick: false, closeButton: false})
        .setLngLat(collegeFeature.geometry.coordinates)
        .setText(collegeFeature.properties.nom)
        .addTo(map)

      const currentCollegeMarker = new maplibregl.Marker(collegeMarkerElement)
        .setLngLat(collegeFeature.geometry.coordinates)
        .addTo(map)

      currentAdresseMarker.getElement().innerHTML = '<img src="/images/map/home.svg">'
      currentCollegeMarker.getElement().innerHTML = '<img src="/images/map/school.svg">'

      adresseMarker.current = currentAdresseMarker
      adressePopup.current = currentAdressePopup
      collegeMarker.current = currentCollegeMarker
      collegePopup.current = currentCollegePopup

      if (prevCollegeFeatureRef.current !== collegeFeature) {
        map.fitBounds([
          adressePosition,
          collegeFeature.geometry.coordinates
        ], {padding: isMobileDevice ? 50 : 200})
      }
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
    prevCollegeFeatureRef.current = collegeFeature
  }, [collegeFeature])

  return (
    <>
      {error && (
        <MapError message={error.message} />
      )}
      <div ref={mapContainer} style={{width: '100%', height: '100%'}} />
    </>
  )
}

Map.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  isMobileDevice: PropTypes.bool
}

Map.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null,
  isMobileDevice: false
}

export default Map
