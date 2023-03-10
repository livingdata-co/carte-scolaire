import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash-es'

import {MOBILE_WIDTH} from '@/contexts/device.js'

import AutocompleteInput from '@/components/search/autocomplete-input.js'
import renderAddok from '@/components/search/render-addok.js'

import {search, isFirstCharValid, secteur, getCollege as getCollegeFeature, getCollegeItineraire} from '@/lib/api.js'

import {useInput} from '@/hooks/input.js'

import colors from '@/styles/colors.js'

const Search = ({handleFocus, onSelectAdresse, onSelectCollege, onSelectCollegeFeature, onSelectCollegeItineraire}) => {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [orderResults, setOrderResults] = useState([])
  const [isForceBlur, setIsForceBlur] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSelect = async feature => {
    setIsForceBlur(false)
    const {label} = feature.properties
    setInput(label)

    try {
      const college = await secteur(feature.geometry.coordinates)

      onSelectAdresse(feature)
      onSelectCollege(college)

      if (college.properties.erreur) {
        onSelectCollegeFeature(null)
        onSelectCollegeItineraire(null)
      } else {
        const collegeFeature = await getCollegeFeature(college.properties.codeRNE)
        onSelectCollegeFeature(collegeFeature)
        const itineraire = await getCollegeItineraire(feature.geometry.coordinates, collegeFeature.geometry.coordinates)
        onSelectCollegeItineraire(itineraire)
      }
    } catch (error) {
      setError(error)
    }

    setIsForceBlur(true)
  }

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await search({q: input, limit: 5})
      setResults(
        results.features
          .filter(({properties}) => !['75056', '13055', '69123'].includes(properties.id)) // Filter Paris, Marseille and Lyon
      )
    } catch (error) {
      setError(error)
    }

    setLoading(false)
  }, 300), [])

  const getFeatureValue = feature => feature.header || feature.properties.name

  useEffect(() => {
    if (results && results.length > 0) {
      const orderResults = []
      results.map(feature => {
        if (!orderResults.some(item => item.header === feature.properties.type)) {
          orderResults.push({
            header: feature.properties.type
          })
        }

        return orderResults.push(feature)
      })

      setOrderResults(orderResults)
    }
  }, [results])

  useEffect(() => {
    const trimmedInput = input.trim()

    if (trimmedInput.length >= 3) {
      if (isFirstCharValid(trimmedInput)) {
        setResults([])
        setLoading(true)
        setError(null)
        handleSearch(trimmedInput)
      } else {
        setError({message: 'Le premier caract??re doit ??tre une lettre ou un chiffre'})
      }
    }
  }, [handleSearch, input])

  useEffect(() => {
    if (input.length <= 3) {
      setResults([])
      setOrderResults([])
    }
  }, [input])

  return (
    <div className='search-wrapper'>
      <AutocompleteInput
        label='Rechercher le coll??ge de rattachement d???une adresse donn??e'
        value={input}
        placeholder='Renseignez une adresse ou une commune'
        ariaLabel='Recherche'
        results={orderResults}
        isLoading={loading}
        isBlur={isForceBlur}
        handleFocus={handleFocus}
        getItemValue={getFeatureValue}
        onRenderItem={renderAddok}
        onValueChange={setInput}
        onSelectValue={handleSelect}
      />

      {error
        && <div className='error'>
          <div className='error-message'>
            {error.message}
          </div>
        </div>}

      <style jsx>{`
        .search-wrapper {
          margin: 1em 0 1em 0;
        }

        @media (max-width: ${MOBILE_WIDTH}px) {
          .search-wrapper {
            margin: 0;
          } 
        }

        .error {
          margin: 1em;
        }

        .error-message {
          color: ${colors.red};
          background:  ${colors.lightRed};
          border: 1px solid ${colors.red};
          border-radius: 5px;
          padding: 1em;
          margin-bottom: 1em;
          position: relative;
        }
      `}</style>
    </div>
  )
}

Search.propTypes = {
  handleFocus: PropTypes.func.isRequired,
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired,
  onSelectCollegeFeature: PropTypes.func.isRequired,
  onSelectCollegeItineraire: PropTypes.func.isRequired
}

export default Search
