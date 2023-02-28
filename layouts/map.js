import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronLeft, ChevronRight} from 'react-feather'

import colors from '@/styles/colors.js'
import size from '@/styles/size.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar.js'

// Mobile layout
export const Mobile = ({selectedAdresse, selectedCollege, onSelectAdresse, onSelectCollege}) => (
  <div className='mobile-layout-container'>
    <div className='mobile-map-wrapper'>
      <Map
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
        flex: 4;
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
export const Desktop = ({selectedAdresse, selectedCollege, onSelectAdresse, onSelectCollege}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className='desktop-layout-container'>
      <div className='layout-sidebar-wrapper'>
        <button
          className='switch-button'
          type='button'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
        {isSidebarOpen && (
          <MapSidebar
            selectedAdresse={selectedAdresse}
            selectedCollege={selectedCollege}
            onSelectAdresse={onSelectAdresse}
            onSelectCollege={onSelectCollege}
          />
        )}
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
          min-width: ${isSidebarOpen ? size.sidebar : '5px'};
          max-width: ${size.sidebar};
          box-shadow: 0px 0px 5px grey;
          height: calc(100vh - ${size.header});
          z-index: 1;
          overflow: auto;
          overflow-x: hidden;
        }

        .switch-button {
          position: absolute;
          top: 25px;
          left: ${isSidebarOpen ? size.sidebar : '5px'};
          background-color:${colors.white};
          height: 50px;
          width: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 0 5px 5px 0;
          box-shadow: 2px 2px 5px grey;
        }

        .layout-map-wrapper {
          width: 100%;
          height: calc(100vh - ${size.header});
        }
      `}</style>
    </div>
  )
}

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

