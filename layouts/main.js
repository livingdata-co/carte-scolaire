/* eslint no-undef: "error" */
/* eslint-env browser */
import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import Header from '@/components/header.js'
import Popup from '@/components/popup.js'

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
          Ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
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
