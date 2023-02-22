import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Popup = ({handleClose}) => (
  <div className='popup-container'>
    <div className='content-container'>
      <h2>Bienvenue sur l’outil carte</h2>

      <button
        type='button'
        onClick={handleClose}
      >
        Accéder à la carte
      </button>
    </div>

    <style jsx>{`
      .popup-container {
        z-index: 9999;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .content-container {
        background: ${colors.white};
        border-radius: 3px;
        padding: 1.5em;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `}</style>
  </div>
)

Popup.propTypes = {
  handleClose: PropTypes.func.isRequired
}

export default Popup
