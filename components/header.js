import {useState} from 'react'
import Image from 'next/image'
import {Info} from 'react-feather'

import colors from '@/styles/colors.js'

import Popup from '@/components/popup.js'
import ModalContent from '@/components/modal-content.js'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <header>
      <div className='presentation'>
        <Image src='/images/logo-ld-short.png' width={30} height={33} />
        <div className='head-title-container'>
          <h1 className='title'>Carte scolaire</h1>
        </div>
      </div>

      <button type='button' onClick={handleModal}>
        <Info size={16} /> À propos
      </button>

      {isModalOpen && (
        <Popup title='Carte Scolaire' onClose={handleModal}>
          <ModalContent />
        </Popup>
      )}

      <style jsx>{`
        header {
          margin: 0;
          padding: 1.5em 1.5em 1.5em 3em;
          color: ${colors.white};
          background: ${colors.darkGrey};
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2em;
        }

        .head-title-container {
          display: flex;
          align-items: center;
          height: 36px;
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
        }

        header button:hover {
          border-bottom: 2px solid ${colors.white};
        }
      `}</style>
    </header>
  )
}

export default Header
