import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for filtering data by date range
 * @component
 * @param {Object} props
 * @param {string} props.fromDate - Start date (YYYY-MM)
 * @param {string} props.toDate - End date (YYYY-MM)
 * @param {(date: string) => void} props.onFromDateChange - Handler for from date changes
 * @param {(date: string) => void} props.onToDateChange - Handler for to date changes
 * @returns {JSX.Element} DateRangeFilter component
 */
const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange }) => {
  return (
    <div className="date-range-filter">
      <div className="date-input-group">
        <label htmlFor="fromDate">From:</label>
        <input
          type="month"
          id="fromDate"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
        />
      </div>
      <div className="date-input-group">
        <label htmlFor="toDate">To:</label>
        <input
          type="month"
          id="toDate"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};

DateRangeFilter.propTypes = {
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  onFromDateChange: PropTypes.func.isRequired,
  onToDateChange: PropTypes.func.isRequired
};

export default DateRangeFilter;