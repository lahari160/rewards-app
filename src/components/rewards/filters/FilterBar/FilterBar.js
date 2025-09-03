import React from 'react';
import PropTypes from 'prop-types';

const FilterBar = ({ filterValue, onFilterChange, placeholder = "Filter by name..." }) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder={placeholder}
        className="filter-input"
      />
    </div>
  );
};

FilterBar.propTypes = {
  filterValue: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default FilterBar;