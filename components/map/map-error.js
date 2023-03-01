import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const MapError = ({message}) => (
  <div className='error'>
    <div>{message}</div>
    <style jsx>{`
      .error {
        color: ${colors.lightRed};
        position: absolute;
        margin: 2em;
        border: 2px solid ${colors.lightRed};
        border-radius: 4px;
        z-index: 1;
        padding: 0.5em;
        background-color: ${colors.red};
      }
    `}</style>
  </div>
)

MapError.propTypes = {
  message: PropTypes.string.isRequired
}

export default MapError
