import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {MOBILE_WIDTH} from '@/contexts/device.js'

import {getCodeDepartement} from '@/lib/util/adresse.js'

function formatDistance(distance) {
  return (Math.round(distance * 10) / 10).toString().replace('.', ',')
}

function formatDuration(minutes) {
  return minutes <= 1 ? 1 : Math.round(minutes)
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
            <p className='college-distance'>Distance : {formatDistance(itineraire.distance)} km</p>
            <p className='college-duration'>Durée du trajet : environ {formatDuration(itineraire.duration)} minutes</p>
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

      @media (max-width: ${MOBILE_WIDTH}px) {
        .college-container {
          font-size: small;
        }
      }
    `}
    </style>
  </div>
)

College.propTypes = {
  college: PropTypes.object.isRequired,
  itineraire: PropTypes.object
}

College.defaultProps = {
  itineraire: null
}

export default College
