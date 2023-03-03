import PropTypes from 'prop-types'

import {useState} from 'react'
import size from '@/styles/size.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar.js'

// Mobile layout
export const Mobile = ({selectedAdresse, selectedCollege, collegeFeature, collegeItineraire, onSelectAdresse, onSelectCollege, onSelectCollegeFeature, onSelectCollegeItineraire}) => {
  const [isInputFocus, setIsInputFocus] = useState(false)

  return (
    <div className='mobile-layout-container'>
      <div className='mobile-map-wrapper'>
        <Map
          isMobileDevice
          selectedAdresse={selectedAdresse}
          selectedCollege={selectedCollege}
          collegeFeature={collegeFeature}
          collegeItineraire={collegeItineraire}
        />
      </div>

      <div className='mobile-sidebar-wrapper'>
        <MapSidebar
          selectedCollege={selectedCollege}
          collegeItineraire={collegeItineraire}
          handleFocus={setIsInputFocus}
          onSelectAdresse={onSelectAdresse}
          onSelectCollege={onSelectCollege}
          onSelectCollegeFeature={onSelectCollegeFeature}
          onSelectCollegeItineraire={onSelectCollegeItineraire}
        />
      </div>

      <style jsx>{`
      .mobile-layout-container {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .mobile-map-wrapper {
        flex: ${isInputFocus ? 0 : 1};
      }

      .mobile-sidebar-wrapper {
        height: ${isInputFocus ? '100%' : 'auto'};
      }
    `}</style>
    </div>
  )
}

Mobile.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  collegeFeature: PropTypes.object,
  collegeItineraire: PropTypes.object,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired,
  onSelectCollegeFeature: PropTypes.func.isRequired,
  onSelectCollegeItineraire: PropTypes.func.isRequired
}

Mobile.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null,
  collegeFeature: null,
  collegeItineraire: null
}

// Desktop layout
export const Desktop = ({selectedAdresse, selectedCollege, collegeFeature, collegeItineraire, onSelectAdresse, onSelectCollege, onSelectCollegeFeature, onSelectCollegeItineraire}) => (
  <div className='desktop-layout-container'>
    <div className='layout-sidebar-wrapper'>
      <MapSidebar
        selectedAdresse={selectedAdresse}
        selectedCollege={selectedCollege}
        collegeItineraire={collegeItineraire}
        onSelectAdresse={onSelectAdresse}
        onSelectCollege={onSelectCollege}
        onSelectCollegeFeature={onSelectCollegeFeature}
        onSelectCollegeItineraire={onSelectCollegeItineraire}
      />
    </div>

    <div className='layout-map-wrapper'>
      <Map
        selectedAdresse={selectedAdresse}
        selectedCollege={selectedCollege}
        collegeFeature={collegeFeature}
        collegeItineraire={collegeItineraire}
      />
    </div>

    <style jsx>{`
      .desktop-layout-container {
        display: flex;
        flex: 1;
      }

      .layout-sidebar-wrapper {
        min-width: ${size.sidebar};
        max-width: ${size.sidebar};
        box-shadow: 0px 0px 5px grey;
        overflow: auto;
        overflow-x: hidden;
      }

      .layout-map-wrapper {
        flex: 1;
      }
    `}</style>
  </div>
)

Desktop.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  collegeFeature: PropTypes.object,
  collegeItineraire: PropTypes.object,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired,
  onSelectCollegeFeature: PropTypes.func.isRequired,
  onSelectCollegeItineraire: PropTypes.func.isRequired

}

Desktop.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null,
  collegeFeature: null,
  collegeItineraire: null
}

