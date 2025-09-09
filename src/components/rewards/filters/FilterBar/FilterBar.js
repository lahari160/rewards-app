import React from 'react';
import PropTypes from 'prop-types';

/**
 * A controlled input component for filtering lists or data.
 *
 * @component
 * @example
 * // Basic usage
 * <FilterBar
 *   filterValue={searchText}
 *   onFilterChange={(value) => setSearchText(value)}
 * />
 *
 * @example
 * // With custom placeholder
 * <FilterBar
 *   filterValue={query}
 *   onFilterChange={handleFilter}
 *   placeholder="Search by email..."
 * />
 *
 * @param {Object} props - Component props
 * @param {string} props.filterValue - The current value of the filter input
 * @param {function} props.onFilterChange - Callback triggered when the filter input changes
 * @param {string} [props.placeholder="Filter by name..."] - Optional placeholder text for the input field
 * @returns {JSX.Element} The filter bar input component
 */
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
  /** The current filter value displayed in the input field */
  filterValue: PropTypes.string.isRequired,
  /** Callback function called with the new value when the input changes */
  onFilterChange: PropTypes.func.isRequired,
  /** Optional placeholder text for the input field */
  placeholder: PropTypes.string
};

export default FilterBar;