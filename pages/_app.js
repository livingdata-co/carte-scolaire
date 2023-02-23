import React from 'react'
import PropTypes from 'prop-types'

import {DeviceContextProvider} from '@/contexts/device.js'

import '../styles/global.css'

const App = ({Component, pageProps}) => (
  <React.StrictMode>
    <DeviceContextProvider>
      <Component {...pageProps} />
    </DeviceContextProvider>
  </React.StrictMode>
)

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
