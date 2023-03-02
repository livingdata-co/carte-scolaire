import PropTypes from 'prop-types'

import Search from '@/components/search/index.js'
import College from '@/components/college.js'

const MapSidebar = ({selectedCollege, collegeItineraire, ...props}) => (
  <>
    <Search {...props} />

    {selectedCollege?.properties && (
      <College college={selectedCollege.properties} itineraire={collegeItineraire} />
    )}
  </>
)

MapSidebar.propTypes = {
  selectedCollege: PropTypes.object,
  collegeItineraire: PropTypes.object
}

MapSidebar.defaultProps = {
  selectedCollege: null,
  collegeItineraire: null
}

export default MapSidebar
