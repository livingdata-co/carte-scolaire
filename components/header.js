import {useState} from 'react'
import Image from 'next/image'
import {Info} from 'react-feather'

import colors from '@/styles/colors.js'

import Popup from '@/components/popup.js'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <header>
      <div className='presentation'>
        <Image src='/images/logo-ld-short.png' width={50} height={56} />
        <div className='head-title-container'>
          <h1>Carte scolaire</h1>
        </div>
      </div>

      <button type='button' onClick={handleModal}>
        <Info /> À propos
      </button>

      {isModalOpen && (
        <Popup title='Carte Scolaire' onClose={handleModal}>
          <p>
            Cet outil permet à toute personne de rechercher le <b>collège de rattachement d’une adresse donnée</b>.<br /><br />
            La recherche s’effectue en entrant une <b>adresse</b>, un <b>lieu-dit</b> ou une <b>commune</b>.<br />
            Une fois l’adresse sélectionnée, l’outil Carte Scolaire vous permet de visualiser la <b>localisation du collège de rattachement</b>, ainsi que la <b>distance</b> et le <b>temps de trajets approximatif</b> en voiture.
            Les données utilisées proviennent de la <a href='https://www.data.gouv.fr/fr/datasets/carte-scolaire-des-colleges-publics/' target='_blank' rel='noreferrer'>carte scolaire des collèges publiques</a>, publiées par le Ministère de l’Éducation Nationale et de la Jeunesse.<br />
          </p>
          <p className='uncovered-departements'><Info />À ce jour un peu plus de 17 000 communes sur 35 000 sont couvertes par ce service.</p>
          <p> <i>Cet outil est proposé à des fins de démonstration. Il ne se substitue pas au processus d’affectation. Ni la qualité des données publiées ni le traitement algorithmique ne permettent de garantir la qualité du résultat. Il est inutile de nous contacter pour constater des écarts entre ce qu’indique l’outil et la situation réelle.</i></p><br />
          <p className='contact'>Une question ? Écrivez-nous sur <a href='mailto:contact@livingdata.co'>contact@livingdata.co</a>.</p>
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
          height: 56px;
          border-left: 4px solid rgba(255, 255, 255, 0.33);
          padding-left: 10px;
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
          padding: .5em 0;
        }

        header button:hover {
          border-bottom: 2px solid ${colors.white};
        }

        p {
          line-height: 30px;
        }

        p b, .uncovered-departements {
          color: ${colors.darkGreen};
        }

        .uncovered-departements {
          width: 100%;
          font-weight: bold;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .contact {
          text-align: center;
          font-weight: bold;
        }
      `}</style>
    </header>
  )
}

export default Header
