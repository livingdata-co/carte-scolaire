import PropTypes from 'prop-types'

import Search from '@/components/search/index.js'

const MapSidebar = ({selectedAdresse, selectedCollege, onSelectAdresse, onSelectCollege}) => (
  <Search
    selectedAdresse={selectedAdresse}
    selectedCollege={selectedCollege}
    onSelectAdresse={onSelectAdresse}
    onSelectCollege={onSelectCollege}
  />
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
