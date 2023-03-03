import {useState} from 'react'
import {uniqueId} from 'lodash-es'

import colors from '@/styles/colors.js'

const legend = [
  {
    circle: true,
    color: colors.green,
    libelle: 'Autre collège'
  },
  {
    circle: true,
    color: colors.blue,
    libelle: 'Autre collège sélectionné'
  },
  {
    circle: false,
    color: 'rgba(0, 83, 179, 0.1)',
    libelle: 'Zones de rattachement'
  },
  {
    circle: false,
    color: 'rgba(0, 83, 179, 0.4)',
    libelle: 'Zones de rattachement du collège sélectionné'
  }
]

const Legend = () => {
  const [isWrap, setIsWrap] = useState(true)

  return (
    <div className='legend'
      onMouseEnter={() => setIsWrap(false)}
      onMouseLeave={() => setIsWrap(true)}
    >
      <div>Légende</div>

      {!isWrap && (
        <div className='legend-wrapper'>
          {legend.map(({libelle, color, circle}) => (
            <div key={uniqueId()}>
              <div key={libelle} className='legend-container'>
                <div className='legend-color' style={{backgroundColor: `${color}`, borderRadius: `${circle ? '25px' : ''}`}} />
                <div>{libelle}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
          .legend {
            position: absolute;
            margin-top: 1em;
            margin-left: 1em;
            box-shadow: none;
            border: 2px solid #dcd8d5;
            border-radius: 4px;
            z-index: 1;
            padding: 0.5em;
            background-color: rgba(255, 255, 255, 0.8);
            max-width: 1000px;
          }

          .legend-wrapper {
            margin-top: 1em;
          }

          .legend-container {
            margin: .5em 0;
            display: flex;
            align-items: center;
          }

          .legend-color {
            width: 15px;
            height: 15px;
            margin-right: 0.5em;
          }
        `}</style>
    </div>

  )
}

export default Legend
