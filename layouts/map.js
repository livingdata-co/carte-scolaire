import {useState} from 'react'
import {ChevronLeft, ChevronRight} from 'react-feather'

import colors from '@/styles/colors.js'

import Map from '@/components/map.js'
import MapSidebar from '@/components/map-sidebar.js'

// Mobile layout
export const Mobile = () => (
  <div>
    <MapSidebar />
  </div>
)

// Desktop layout
export const Desktop = () => {
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
          <MapSidebar />
        )}
      </div>

      <div className='layout-map-wrapper'>
        <Map />
      </div>

      <style jsx>{`
        .desktop-layout-container {
          display: flex;
          contain: content;
        }

        .layout-sidebar-wrapper {
          min-width: ${isSidebarOpen ? '460px' : '5px'};
          max-width: 460px;
          box-shadow: 0px 0px 5px grey;
          height: calc(100vh - 117px);
          z-index: 1;
          overflow: auto;
          overflow-x: hidden;
        }

        .switch-button {
          position: absolute;
          top: 25px;
          left: ${isSidebarOpen ? '460px' : '5px'};
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
          height: calc(100vh - 117px);
        }
      `}</style>
    </div>
  )
}

