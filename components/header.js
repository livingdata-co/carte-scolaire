import {useState} from 'react'
import Image from 'next/image'
import {Info} from 'react-feather'

import colors from '@/styles/colors.js'
import {MOBILE_WIDTH} from '@/contexts/device.js'

import Popup from '@/components/popup.js'
import ModalContent from '@/components/modal-content.js'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <header>
      <div className='presentation'>
        <Image src='/images/logo-ld-short.png' width={58} height={65} alt='Logo Living Data' />
        <div className='head-title-container'>
          <h1 className='title'>Carte scolaire</h1>
        </div>
      </div>

      <button type='button' onClick={handleModal}>
        <Info size={24} /> <span>À propos</span>
      </button>

      {isModalOpen && (
        <Popup title='Carte Scolaire' onClose={handleModal}>
          <ModalContent />
        </Popup>
      )}

      <style jsx>{`
        header {
          margin: 0;
          padding: 1em 1.5em 1em 3em;
          color: ${colors.white};
          background: ${colors.darkGrey};
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          align-items: center;
          gap: 1em;
        }

        @media (max-width: ${MOBILE_WIDTH}px) {
          header {
            padding: 1em;
          }

          button span {
            display: none;
          }
        }

        .head-title-container {
          display: flex;
          align-items: center;
          height: 65px;
          border-left: 4px solid rgba(255, 255, 255, 0.33);
          padding-left: 10px;
        }

        .title {
          font-size: 1.5em;
        }

        .presentation {
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 3em;
        }

        header button {
          width: fit-content;
          height: fit-content;
          color: ${colors.white};
          background: none;
          border: none;
          font-size: 1.1em;
          display: flex;
          align-items: center;
          gap: .5em;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          padding: 0;
        }

        header button:hover {
          border-bottom: 2px solid ${colors.white};
        }
      `}</style>
    </header>
  )
}

export default Header
