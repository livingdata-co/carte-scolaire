import PropTypes from 'prop-types'

import Search from '@/components/search/index.js'
import College from '@/components/college.js'

const MapSidebar = ({selectedAdresse, selectedCollege, onSelectAdresse, onSelectCollege}) => (
  <>
    <Search
      selectedAdresse={selectedAdresse}
      selectedCollege={selectedCollege}
      onSelectAdresse={onSelectAdresse}
      onSelectCollege={onSelectCollege}
    />

    {selectedCollege?.properties && (
      <College college={selectedCollege.properties} />
    )}
  </>
)

MapSidebar.propTypes = {
  selectedAdresse: PropTypes.object,
  selectedCollege: PropTypes.object,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired
}

MapSidebar.defaultProps = {
  selectedAdresse: null,
  selectedCollege: null
}

export default MapSidebar
