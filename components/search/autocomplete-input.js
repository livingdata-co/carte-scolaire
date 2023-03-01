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
        <div style={{margin: '.5em', textAlign: 'center', color: colors.darkGrey, fontWeight: 'bold', fontSize: '1.1em'}}>{label}</div>
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
            background-color: ${colors.darkGrey};
            border: 1px solid ${colors.black};
            border-radius: 5px;
            color: ${colors.white};
            display: block;
            font-family: inherit;
            font-size: 14px;
            height: 56px;
            padding: 7px;
            padding-right: 2.5em;
            width: 100%;
          }

          ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: ${colors.grey};
            font-size: 1.1em;
            font-style: italic;
            opacity: 1; /* Firefox */
          }

          ::-ms-input-placeholder { /* Microsoft Edge */
            color: ${colors.grey};
          }

          .icon {
            display: inline-flex;
            padding: 1em;
            background-color: ${colors.darkGreen};
            color: ${colors.white};
            vertical-align: top;
            position: absolute;
            right: 1em;
            border-radius: 0 3px 3px 0;
            top: 50%;
            transform: translateY(-50%);
          }

          input {
            text-indent: 1em;
            color: ${colors.white};
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
            box-shadow: 0 1px 4px ${colors.grey};
            background-color: ${colors.white};
            color: ${colors.black};
            border-radius: 0 0 5px 5px;
            position: absolute;
            z-index: 999;
            width: 90%;
          }

          .item {
            display: flex;
            position: relative;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            padding: 2em;
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
