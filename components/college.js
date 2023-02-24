import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {getCodeDepartement} from '@/lib/util/adresse.js'

const College = ({college}) => (
  <div className='college-container'>
    {college.erreur ? (
      <p>{college.erreur}</p>
    ) : (
      <>
        <h2 className='college-nom'>{college.nom}</h2>
        <p className='college-etablissement'>{college.nomCommuneEtablissement} ({getCodeDepartement(college.codeCommune)})</p>
      </>
    )}
    <style jsx>{`
      .college-container {
        margin-top: 1em;
        padding: 20px;
        background-color: ${colors.green};
        color: white;
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
  college: PropTypes.object.isRequired
}

export default College
