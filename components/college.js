import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {getCodeDepartement} from '@/lib/util/adresse.js'

const arroundNumber = number => {
  const arround = Math.round(number * 10) / 10
  return arround.toString().replace('.', ',')
}

const arroundMinutes = minutes => {
  if (minutes % 1 < 0.5) {
    return Math.floor(minutes)
  }

  return Math.ceil(minutes)
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
            <p className='college-distance'>Distance : {arroundNumber(itineraire.distance)} km</p>
            <p className='college-duration'>Durée du trajet : environ {arroundMinutes(itineraire.duration)} minutes</p>
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

      .college-duration {
        margin-bottom: 5px;
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
