import {useCallback} from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'
import {Search} from 'react-feather'

import Loader from '@/components/loader.js'
import colors from '@/styles/colors.js'

const AutocompleteInput = ({
  label,
  value,
  placeholder,
  ariaLabel,
  results,
  isLoading,
  getItemValue,
  onRenderItem,
  onValueChange,
  onSelectValue
}) => {
  const handleSearch = useCallback(event => {
    onValueChange(event.target.value)
  }, [onValueChange])

  const handleSelect = useCallback((itemName, item) => {
    onSelectValue(item)
  }, [onSelectValue])

  const renderInput = props => (
    <>
      {label && (
        <div style={{marginTop: '1em', textAlign: 'center'}}>{label}</div>
      )}
      <div className='search-input-container' role='search'>

        <input
          type='search'
          aria-label={ariaLabel}
          className='search'
          placeholder={placeholder}
          {...props}
        />

        <span className='icon'><Search alt='' aria-hidden='true' /></span>

        <style jsx>{`
          .search-input-container {
            position: relative;
            padding: 0.5em 1em;
          }

          .search {
            background-color: ${colors.white};
            border: 1px solid ${colors.black};
            border-radius: 2px 2px 2px 2px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
            color: rgba(0, 0, 0, 0.75);
            display: block;
            font-family: inherit;
            font-size: 14px;
            height: 56px;
            padding: 7px;
            padding-right: 2.5em;
            width: 100%;
          }

          .icon {
            display: inline-flex;
            vertical-align: top;
            position: absolute;
            right: 2em;
            top: 50%;
            transform: translateY(-50%);
          }

          input {
            text-indent: 1em;
          }
        `}</style>
      </div>
    </>
  )

  const renderMenu = useCallback((items, value) => (
    <div className='menu-container'>
      <div className={value.length > 0 ? 'menu' : 'hidden'}>
        {isLoading && items.length === 0 ? (
          <div className='item'><Loader size='small' /></div>
        ) : (items.length === 0 ? (
          <div className='item'>Aucun résultat</div>
        ) : items)}

      </div>
      <style jsx>{`
          .menu-container {
            position: relative;
            padding: 0 1em;
          }

          .menu {
            box-shadow: 0 1px 4px ${colors.black};
            background-color: ${colors.white};
            border: 1px solid ${colors.black};
            color: ${colors.black};
            border-radius: 0 0 5px 5px;
          }

          .item {
            display: flex;
            position: relative;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            padding: 1em;
          }

          .hidden {
            display: none;
          }
        `}</style>
    </div>
  ), [isLoading])

  return (
    <Autocomplete
      value={value}
      items={results}
      renderItem={(item, isHighlighted) => onRenderItem(item, isHighlighted)}
      renderMenu={renderMenu}
      renderInput={renderInput}
      wrapperStyle={{width: '100%'}}
      getItemValue={getItemValue}
      onChange={handleSearch}
      onSelect={handleSelect}
    />
  )
}

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  results: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getItemValue: PropTypes.func.isRequired,
  onRenderItem: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  onSelectValue: PropTypes.func.isRequired
}

AutocompleteInput.defaultProps = {
  label: '',
  value: '',
  placeholder: null,
  ariaLabel: null
}

export default AutocompleteInput
