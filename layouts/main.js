import PropTypes from 'prop-types'

import Header from '@/components/header.js'

const Main = ({children}) => (
  <>
    <Header />
    <main>{children}</main>
  </>
)

Main.propTypes = {
  children: PropTypes.node
}

Main.defaultProps = {
  children: null
}

export default Main
