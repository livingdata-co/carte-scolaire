/* eslint no-undef: "error" */
/* eslint-env browser */
import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import Header from '@/components/header.js'
import Popup from '@/components/popup.js'
import ModalContent from '@/components/modal-content.js'

const Main = ({children}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const popupSeen = localStorage.getItem('popupSeen')
      if (popupSeen) {
        setIsModalOpen(false)
      } else {
        setIsModalOpen(true)
      }
    }
  }, [])

  const handlePopupClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('popupSeen', true)
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Header />
      <main>{children}</main>

      {isModalOpen && (
        <Popup title='Bienvenu sur l’outil carte scolaire' onClose={handlePopupClose}>
          <ModalContent />
        </Popup>
      )}
    </>
  )
}

Main.propTypes = {
  children: PropTypes.node
}

Main.defaultProps = {
  children: null
}

export default Main
