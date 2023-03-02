/* eslint no-undef: "error" */
/* eslint-env browser */
import {useState, useEffect} from 'react'
import Head from 'next/head'
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
      <Head>
        <title>Carte scolaire - Living Data</title>
        <link rel='icon' type='image/png' sizes='500x565' href='/images/logo-ld-short.png' />
        <meta name='description' content='Rechercher le collège de rattachement d’une adresse donnée.' />
        <meta name='author' content='Living Data' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width, maximum-scale=1' />
        <meta charSet='utf-8' />
        <meta name='twitter:card' content='app' />
        <meta name='twitter:url' content='https://carte-scolaire.livingdata.co' />
        <meta name='twitter:title' content='Carte scolaire - Living Data' />
        <meta name='twitter:description' content='Rechercher le collège de rattachement d’une adresse donnée.' />
        <meta name='twitter:image' content='https://carte-scolaire.livingdata.co/images/logo-ld-short.png' />
        <meta name='twitter:creator' content='@_LivingData' />
        <meta name='twitter:site' content='@_LivingData' />
        <meta property='og:url' content='https://carte-scolaire.livingdata.co' />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Carte scolaire' />
        <meta property='og:title' content='Carte scolaire - Living Data' />
        <meta property='og:description' content='Rechercher le collège de rattachement d’une adresse donnée.' />
        <meta property='og:locale' content='fr_FR' />
        <meta property='og:image' content='https://carte-scolaire.livingdata.co/images/logo-ld-short.png' />
        <meta property='og:image:secure_url' content='https://carte-scolaire.livingdata.co/images/logo-ld-short.png' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:width' content='500' />
        <meta property='og:image:height' content='565' />
        <meta property='og:image:alt' content='Logo Living Data' />
      </Head>
      <Header />
      <main>{children}</main>

      {isModalOpen && (
        <Popup title='Bienvenue sur l’outil Carte Scolaire' onClose={handlePopupClose}>
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
