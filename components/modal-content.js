import {Info} from 'react-feather'

import colors from '@/styles/colors.js'

const ModalContent = () => (
  <div>
    <p>
      Cet outil permet à toute personne de rechercher le <b>collège de rattachement d’une adresse donnée</b>.<br /><br />
      La recherche s’effectue en entrant une <b>adresse</b>, un <b>lieu-dit</b> ou une <b>commune</b>.<br />
      Une fois l’adresse sélectionnée, l’outil Carte Scolaire vous permet de visualiser la <b>localisation du collège de rattachement</b>, ainsi que la <b>distance</b> et le <b>temps de trajets approximatif</b> en voiture.
      Les données utilisées proviennent de la <a href='https://www.data.gouv.fr/fr/datasets/carte-scolaire-des-colleges-publics/' target='_blank' rel='noreferrer'>carte scolaire des collèges publiques</a>, publiées par le Ministère de l’Éducation Nationale et de la Jeunesse.<br />
    </p>
    <p className='uncovered-departements'><Info />À ce jour un peu plus de 17 000 communes sur 35 000 sont couvertes par ce service.</p>
    <p> <i>Cet outil est proposé à des fins de démonstration. Il ne se substitue pas au processus d’affectation. Ni la qualité des données publiées ni le traitement algorithmique ne permettent de garantir la qualité du résultat. Il est inutile de nous contacter pour constater des écarts entre ce qu’indique l’outil et la situation réelle.</i></p><br />
    <p className='contact'>Une question ? Écrivez-nous sur <a href='mailto:contact@livingdata.co'>contact@livingdata.co</a>.</p>
    <style jsx>{`
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
  </div>
)

export default ModalContent
