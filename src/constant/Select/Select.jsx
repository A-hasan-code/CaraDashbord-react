import React from 'react';
import Select from 'react-select';

const SelectComponent = ({ options, value, onChange, placeholder, onInputChange, styles }) => {
  return (
    <Select
      isMulti                  // Multi-select enabled
      options={options}        // Options passed from parent
      value={value}            // Selected values (array)
      onChange={onChange}      // Handle changes (selection/deselection)
      placeholder={placeholder}
      components={{ DropdownIndicator: null }}  // You can customize the dropdown indicator (if needed)
      styles={styles}          // Custom styles (if any)
      onInputChange={onInputChange}  // Handle input changes
    />
  );
};

export default SelectComponent;
