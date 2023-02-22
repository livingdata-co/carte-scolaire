import PropTypes from 'prop-types'

import Header from '@/components/header.js'

const Main = ({children}) => (
  <div>
    <Header />
    <main>{children}</main>
  </div>
)

Main.propTypes = {
  children: PropTypes.node
}

Main.defaultProps = {
  children: null
}

export default Main
