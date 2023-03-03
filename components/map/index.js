import {useEffect, useRef, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'

import {sources} from '@/components/map/sources.js'
import {layers} from '@/components/map/layers.js'
import Legend from '@/components/map/legend.js'
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
  const otherCollegesPopup = useRef(null)
  const selectedCollegeIdRef = useRef(null)
  const selectedCollegeFeatureRef = useRef(collegeFeature)
  const map = useRef(null)

  const toggleCollegeState = useCallback(collegeId => {
    if (selectedCollegeIdRef.current === collegeId) {
      map.current.setFeatureState({
        source: 'secteurs',
        sourceLayer: 'colleges',
        id: selectedCollegeIdRef.current
      }, {selected: false})

      selectedCollegeIdRef.current = null
      return
    }

    if (selectedCollegeIdRef.current) {
      map.current.setFeatureState({
        source: 'secteurs',
        sourceLayer: 'colleges',
        id: selectedCollegeIdRef.current
      }, {selected: false})
    }

    selectedCollegeIdRef.current = collegeId

    map.current.setFeatureState({
      source: 'secteurs',
      sourceLayer: 'colleges',
      id: selectedCollegeIdRef.current
    }, {selected: true})
  }, [])

  const changeSecteurOpacity = useCallback(() => {
    if (selectedCollegeIdRef.current) {
      map.current.setPaintProperty('secteurs-fill', 'fill-opacity',
        [
          'case',
          ['==', ['get', 'codeRNE'], selectedCollegeIdRef.current],
          0.4,
          0.1
        ])
    }
  }, [])

  const toggleSecteursVisibility = useCallback(() => {
    if (selectedCollegeIdRef.current) {
      map.current.setLayoutProperty('secteurs-lines', 'visibility', 'visible')
      map.current.setLayoutProperty('secteurs-fill', 'visibility', 'visible')
    } else {
      map.current.setLayoutProperty('secteurs-lines', 'visibility', 'none')
      map.current.setLayoutProperty('secteurs-fill', 'visibility', 'none')
    }
  }, [])

  const handleSelectedCollegeClick = useCallback(collegeId => {
    toggleCollegeState(collegeId)
    toggleSecteursVisibility(collegeId)
    changeSecteurOpacity(collegeId)
  }, [changeSecteurOpacity, toggleCollegeState, toggleSecteursVisibility])

  const handleCollegeClick = useCallback((e, selectedCollegeFeatureRef) => {
    toggleCollegeState(e.features[0].id)
    toggleSecteursVisibility(e.features[0].id)
    changeSecteurOpacity(e.features[0].id)

    if (otherCollegesPopup.current) {
      otherCollegesPopup.current.remove()
    }

    if (otherCollegesPopup.current && !selectedCollegeIdRef.current) {
      otherCollegesPopup.current.remove()
      return
    }

    if (e.features[0].properties.codeRNE !== selectedCollegeFeatureRef?.current?.properties?.codeRNE) {
      const currentOtherCollegesPopup = new maplibregl.Popup({offset: 25})
        .setLngLat(e.lngLat)
        .setText(e.features[0].properties.nom)
        .addTo(map.current)

      otherCollegesPopup.current = currentOtherCollegesPopup
    }
  }, [changeSecteurOpacity, toggleCollegeState, toggleSecteursVisibility])

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
      selectedCollegeFeatureRef.current = collegeFeature

      const adresseMarkerElement = document.createElement('div') // eslint-disable-line no-undef
      const collegeMarkerElement = document.createElement('div') // eslint-disable-line no-undef
      collegeMarkerElement.style.cursor = 'pointer'

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

      currentAdresseMarker.getElement().innerHTML = `<img width="${isMobileDevice ? '400px' : ''}" src="/images/map/home.svg">`
      currentCollegeMarker.getElement().innerHTML = `<img width="${isMobileDevice ? '400px' : ''}" src="/images/map/school.svg">`

      collegeMarkerElement.addEventListener('click', () => {
        handleSelectedCollegeClick(collegeFeature.properties.codeRNE)
      })

      adresseMarker.current = currentAdresseMarker
      adressePopup.current = currentAdressePopup
      collegeMarker.current = currentCollegeMarker
      collegePopup.current = currentCollegePopup

      map.current.fitBounds([
        adressePosition,
        collegeFeature.geometry.coordinates
      ], {padding: isMobileDevice ? 50 : 200})
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
  }, [selectedAdresse, collegeFeature, map, isMobileDevice, handleSelectedCollegeClick])

  const createOrChangeSource = useCallback(() => {
    if (collegeItineraire) {
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

      if (map.current.getLayer('colleges')) {
        map.current.setFilter('colleges', [
          'all',
          ['==', 'secteur', 'Public'],
          ['!has', 'erreur'],
          ['!=', 'codeRNE', collegeFeature.properties.codeRNE]
        ])
      }

      map.current.getSource('itineraire').setData({
        type: 'Feature',
        geometry: collegeItineraire?.geometry
      })
    }
  }, [collegeItineraire, collegeFeature])

  const memorizedChangingSource = useMemo(() => createOrChangeSource, [createOrChangeSource])

  useEffect(() => {
    if (map.current) {
      map.current.on('sourcedata', e => {
        if (e.isSourceLoaded) {
          memorizedChangingSource()
        }
      })
    }
  }, [map, memorizedChangingSource])

  const onCollegeHover = () => {
    map.current.getCanvas().style.cursor = 'pointer'
  }

  const onCollegeLeave = () => {
    map.current.getCanvas().style.cursor = 'grab'
  }

  useEffect(() => {
    if (!map.current) {
      return
    }

    map.current.on('click', 'colleges', e => handleCollegeClick(e, selectedCollegeFeatureRef))
    map.current.on('mousemove', 'colleges', onCollegeHover)
    map.current.on('mouseleave', 'colleges', onCollegeLeave)

    return () => {
      map.current.off('click', 'colleges', e => handleCollegeClick(e, selectedCollegeFeatureRef))
      map.current.off('mousemove', 'colleges', onCollegeHover)
      map.current.off('mouseleave', 'colleges', onCollegeLeave)
    }
  }, [map, handleCollegeClick, selectedCollegeFeatureRef])

  return (
    <>
      <Legend />
      <div ref={mapContainer} style={{width: '100%', height: '100%'}} />
    </>
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
