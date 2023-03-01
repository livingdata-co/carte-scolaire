import PropTypes from 'prop-types'

import size from '@/styles/size.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar.js'

// Mobile layout
export const Mobile = ({selectedAdresse, selectedCollege, onSelectAdresse, onSelectCollege}) => (
  <div className='mobile-layout-container'>
    <div className='mobile-map-wrapper'>
      <Map
        isMobileDevice
        selectedAdresse={selectedAdresse}
        selectedCollege={selectedCollege}
      />
    </div>

    <div className='mobile-sidebar-wrapper'>
      <MapSidebar
        selectedAdresse={selectedAdresse}
        selectedCollege={selectedCollege}
        onSelectAdresse={onSelectAdresse}
        onSelectCollege={onSelectCollege}
      />
    </div>

    <style jsx>{`
      .mobile-layout-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - ${size.header});
      }

      .mobile-map-wrapper {
        flex: 6;
        flex-shrink: 0;
      }

      .mobile-sidebar-wrapper {
        flex: 1;
        flex-shrink: 0;
      }
    `}</style>
  </div>
)

Mobile.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired
}

Mobile.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null
}

// Desktop layout
export const Desktop = ({selectedAdresse, selectedCollege, onSelectAdresse, onSelectCollege}) => (
  <div className='desktop-layout-container'>
    <div className='layout-sidebar-wrapper'>
      <MapSidebar
        selectedAdresse={selectedAdresse}
        selectedCollege={selectedCollege}
        onSelectAdresse={onSelectAdresse}
        onSelectCollege={onSelectCollege}
      />
    </div>

    <div className='layout-map-wrapper'>
      <Map
        selectedAdresse={selectedAdresse}
        selectedCollege={selectedCollege}
      />
    </div>

    <style jsx>{`
      .desktop-layout-container {
        display: flex;
        contain: content;
      }

      .layout-sidebar-wrapper {
        min-width: ${size.sidebar};
        max-width: ${size.sidebar};
        box-shadow: 0px 0px 5px grey;
        height: calc(100vh - ${size.header});
        z-index: 1;
        overflow: auto;
        overflow-x: hidden;
      }

      .layout-map-wrapper {
        width: 100%;
        height: calc(100vh - ${size.header});
      }
    `}</style>
  </div>
)

Desktop.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired
}

Desktop.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null
}

