import colors from '@/styles/colors.js'

const featuresTypes = {
  housenumber: 'Numéro',
  street: 'Rue',
  locality: 'Lieu-dit',
  hamlet: 'Hameau',
  village: 'Village',
  city: 'Ville',
  municipality: 'Commune'
}

function renderHeader(header) {
  return (
    <div>
      <div key={header} className='header'>{featuresTypes[header]}</div>
      <style jsx>{`
          .header {
            background-color: ${colors.darkGreen};
            color: ${colors.white};
            padding: .5em;
          }
        `}
      </style>
    </div>
  )
}

function renderItem(item, isHighlighted) {
  const {name, context, city, type, postcode} = item.properties

  return (
    <div>
      <div key={`${name}-${postcode}`} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
        <div>
          <div className='item-label'>{name}</div>
        </div>
        {type === 'municipality'
          ? <div>{context}</div>
          : <div>{city} - {postcode}</div>}
      </div>
      <style jsx>{`
        .item {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          padding: 0.5em;
        }

        .item .item-label {
          font-weight: 600;
        }

        .item:hover {
          cursor: pointer;
        }

        .item-highlighted {
          background-color: ${colors.blue};
          color: ${colors.white};
        }
        `}</style>
    </div>
  )
}

export default function RenderAddok(item, isHighlighted) {
  return item.header ? renderHeader(item.header) : renderItem(item, isHighlighted)
}
