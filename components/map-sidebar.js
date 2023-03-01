import PropTypes from 'prop-types'

import Search from '@/components/search/index.js'
import College from '@/components/college.js'

const MapSidebar = ({selectedAdresse, selectedCollege, collegeFeature, collegeItineraire, onSelectAdresse, onSelectCollege, onSelectCollegeFeature, onSelectCollegeItineraire}) => (
  <>
    <Search
      selectedAdresse={selectedAdresse}
      selectedCollege={selectedCollege}
      collegeFeature={collegeFeature}
      collegeItineraire={collegeItineraire}
      onSelectAdresse={onSelectAdresse}
      onSelectCollege={onSelectCollege}
      onSelectCollegeFeature={onSelectCollegeFeature}
      onSelectCollegeItineraire={onSelectCollegeItineraire}
    />

    {selectedCollege?.properties && (
      <College college={selectedCollege.properties} itineraire={collegeItineraire} />
    )}
  </>
)

MapSidebar.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  collegeFeature: PropTypes.object,
  collegeItineraire: PropTypes.object,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired,
  onSelectCollegeFeature: PropTypes.func.isRequired,
  onSelectCollegeItineraire: PropTypes.func.isRequired
}

MapSidebar.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null,
  collegeFeature: null,
  collegeItineraire: null
}

export default MapSidebar
