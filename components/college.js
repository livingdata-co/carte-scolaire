import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {getCodeDepartement} from '@/lib/util/adresse.js'

const arroundNumber = number => {
  const arround = Math.round(number * 100) / 100
  return arround.toString().replace('.', ',')
}

const College = ({college, itineraire}) => (
  <div className='college-container'>
    {college.erreur ? (
      <p>{college.erreur}</p>
    ) : (
      <>
        <h2 className='college-nom'>{college.nom}</h2>
        <p className='college-etablissement'>{college.nomCommuneEtablissement} ({getCodeDepartement(college.codeCommune)})</p>
        {itineraire && (
          <>
            <p className='college-itineraire'>Distance : {arroundNumber(itineraire.distance)} km</p>
            <p className='college-itineraire'>Durée de trajet : {arroundNumber(itineraire.duration)} minutes</p>
          </>
        )}
      </>
    )}
    <style jsx>{`
      .college-container {
        margin-top: 1em;
        padding: 20px;
        background-color: ${colors.green};
        color: ${colors.white};
        box-shadow: inset 0 10px 9px -10px ${colors.black};
      }

      .college-nom {
        margin: 0;
      }

      .college-etablissement {
        margin: 20px 0;
      }
    `}
    </style>
  </div>
)

College.propTypes = {
  college: PropTypes.object.isRequired,
  itineraire: PropTypes.object
}

College.defualtProps = {
  itineraire: null
}

export default College
