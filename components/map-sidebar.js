import PropTypes from 'prop-types'

import Search from '@/components/search/index.js'
import College from '@/components/college.js'

const MapSidebar = ({selectedAdresse, selectedCollege, collegeFeature, onSelectAdresse, onSelectCollege, onSelectCollegeFeature}) => (
  <>
    <Search
      selectedAdresse={selectedAdresse}
      selectedCollege={selectedCollege}
      collegeFeature={collegeFeature}
      onSelectAdresse={onSelectAdresse}
      onSelectCollege={onSelectCollege}
      onSelectCollegeFeature={onSelectCollegeFeature}
    />

    {selectedCollege?.properties && (
      <College college={selectedCollege.properties} />
    )}
  </>
)

MapSidebar.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  collegeFeature: PropTypes.object,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired,
  onSelectCollegeFeature: PropTypes.func.isRequired
}

MapSidebar.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null,
  collegeFeature: null
}

export default MapSidebar
