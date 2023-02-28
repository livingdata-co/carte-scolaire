import {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'

import {sources} from '@/components/map/sources.js'
import {layers} from '@/components/map/layers.js'
import MapError from '@/components/map/map-error.js'

import {getCollegeLocation} from '@/lib/api.js'

const Map = ({selectedAdresse, selectedCollege}) => {
  const mapContainer = useRef(null)
  const adresseMarker = useRef(null)
  const collegeMarker = useRef(null)
  const collegePopup = useRef(null)
  const [map, setMap] = useState(null)
  const [collegeLocation, setCollegeLocation] = useState(null)
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
      const collegeLocation = await getCollegeLocation(codeRNE)
      setCollegeLocation(collegeLocation)
    } catch (error_) {
      setError(error_)
    }
  }

  useEffect(() => {
    if (selectedCollege) {
      setError(null)

      const {error, codeRNE} = selectedCollege.properties

      if (!error && codeRNE) {
        getCoordinates(codeRNE)
      }
    }
  }, [selectedCollege])

  useEffect(() => {
    if (selectedAdresse && collegeLocation && map) {
      const adressePosition = selectedAdresse.geometry.coordinates

      if (adresseMarker.current || collegeMarker.current || collegePopup.current) {
        adresseMarker.current.remove()
        collegeMarker.current.remove()
        collegePopup.current.remove()
      }

      const adresseMarkerElement = document.createElement('div') // eslint-disable-line no-undef
      const collegeMarkerElement = document.createElement('div') // eslint-disable-line no-undef

      const currentAdresseMarker = new maplibregl.Marker(adresseMarkerElement)
        .setLngLat(adressePosition)
        .addTo(map)

      const currentCollegePopup = new maplibregl.Popup({offset: 25, closeOnClick: false, closeButton: false})
        .setLngLat(collegeLocation.coordinates)
        .setText(collegeLocation.adresseEtablissement)
        .addTo(map)

      const currentCollegeMarker = new maplibregl.Marker(collegeMarkerElement)
        .setLngLat(collegeLocation.coordinates)
        .addTo(map)

      currentAdresseMarker.getElement().innerHTML = '<img src="/images/map/home.svg">'
      currentCollegeMarker.getElement().innerHTML = '<img src="/images/map/pen.svg">'

      map.fitBounds([adressePosition, collegeLocation.coordinates], {padding: 50})

      adresseMarker.current = currentAdresseMarker
      collegeMarker.current = currentCollegeMarker
      collegePopup.current = currentCollegePopup
    }
  }, [selectedAdresse, collegeLocation, map])

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
  selectedCollege: PropTypes.object
}

Map.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null
}

export default Map
