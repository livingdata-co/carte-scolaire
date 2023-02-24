import PropTypes from 'prop-types'

import Search from '@/components/search/index.js'

const MapSidebar = ({setData}) => (
  <Search setData={setData} />
)

MapSidebar.propTypes = {
  setData: PropTypes.func.isRequired
}

export default MapSidebar
