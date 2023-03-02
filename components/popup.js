/* eslint-disable no-undef */
import {useEffect, useRef, useContext} from 'react'
import PropTypes from 'prop-types'
import {XSquare} from 'react-feather'

import DeviceContext from '@/contexts/device.js'

import colors from '@/styles/colors.js'

const Popup = ({title, children, onClose}) => {
  const {isMobileDevice} = useContext(DeviceContext)
  const modalRef = useRef()

  useEffect(() => {
    const listener = event => {
      if (!modalRef.current || modalRef.current.contains(event.target)) {
        return
      }

      onClose()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [onClose])

  return (
    <div className='popup-wrapper'>
      <div ref={modalRef} className='popup-content-container'>
        <div className='close-container'>
          <button type='button' className='close-button' onClick={onClose}>
            <XSquare />
          </button>
        </div>
        <div className='modal-title'>{title}</div>
        <div>
          {children}
        </div>
      </div>

      <style jsx>{`
        .popup-wrapper {
          color: ${colors.darkGrey};
          z-index: 9999;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 1em;
        }

        .popup-content-container {
          background: ${colors.white};
          padding: 2em;
          border-radius: 4px;
          max-width: 900px;
          ${isMobileDevice ? 'height: 80%;' : ''}
          overflow-y: scroll;
        }

        .close-container {
          display: flex;
          justify-content: flex-end;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
        }

        .modal-title {
          font-size: 1.5em;
          border-bottom: 3px solid rgba(54, 76, 99, 0.29);
          padding-bottom: .5em;
          margin: 1em 0;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Popup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
}

Popup.defaultProps = {
  title: null,
  children: null
}

export default Popup
