import React from 'react'
import Select from 'react-select'

const SelectComponent = (prop) => {
  return (
    <>
      <Select
        isMulti
        options={prop.options}
        value={prop.value}
        onChange={prop.onChange}
        placeholder={prop.placeholder}
        components={{ DropdownIndicator: null }}
        styles={prop.styles}
        onInputChange={prop.onInputChange}
      />
    </>
  )
}

export default SelectComponent;