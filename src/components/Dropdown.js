import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ options, initialValue, label, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);

    // Call the parent component's onChange handler
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div>
      {label && <label>{label}</label>}
      <select value={selectedValue} onChange={handleChange}>
        <option value="" disabled>Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  initialValue: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default Dropdown;