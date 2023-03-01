import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash-es'

import AutocompleteInput from '@/components/search/autocomplete-input.js'
import renderAddok from '@/components/search/render-addok.js'

import {search, isFirstCharValid, secteur, getCollege as getCollegeFeature, getCollegeItineraire} from '@/lib/api.js'

import {useInput} from '@/hooks/input.js'

import colors from '@/styles/colors.js'

const Search = ({onSelectAdresse, onSelectCollege, onSelectCollegeFeature, onSelectCollegeItineraire}) => {
  const [input, setInput] = useInput('')
  const [results, setResults] = useState([])
  const [orderResults, setOrderResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCollege = async coordinates => {
    try {
      const college = await secteur(coordinates)
      return college
    } catch (error) {
      setError(error)
    }
  }

  const getFeature = async codeRNE => {
    try {
      const collegeFeature = await getCollegeFeature(codeRNE)
      return collegeFeature
    } catch (error) {
      setError(error)
    }
  }

  const getItineraire = async (start, end) => {
    try {
      const itineraire = await getCollegeItineraire(start, end)
      return itineraire
    } catch (error) {
      setError(error)
    }
  }

  const handleSelect = async feature => {
    const {label} = feature.properties
    setInput(label)

    const college = await getCollege(feature.geometry.coordinates)

    onSelectAdresse(feature)
    onSelectCollege(college)

    if (college.properties.erreur) {
      onSelectCollegeFeature(null)
      onSelectCollegeItineraire(null)
    } else {
      const collegeFeature = await getFeature(college.properties.codeRNE)
      onSelectCollegeFeature(collegeFeature)
      const itineraire = await getItineraire(feature.geometry.coordinates, collegeFeature.geometry.coordinates)
      onSelectCollegeItineraire(itineraire)
    }
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
        setError({message: 'Le premier caractère doit être une lettre ou un chiffre'})
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
        label='Rechercher le collège associé à une zone résidentielle'
        value={input}
        placeholder='Renseignez votre adresse'
        ariaLabel='Recherche'
        results={orderResults}
        isLoading={loading}
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
          margin-top: 1.5em;
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
  onSelectAdresse: PropTypes.func.isRequired,
  onSelectCollege: PropTypes.func.isRequired,
  onSelectCollegeFeature: PropTypes.func.isRequired,
  onSelectCollegeItineraire: PropTypes.func.isRequired
}

export default Search
