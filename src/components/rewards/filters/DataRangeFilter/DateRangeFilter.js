import React from "react";
import PropTypes from "prop-types";

/**
 * Component for filtering data by date range
 * @component
 * @param {Object} props
 * @param {string} props.fromDate - Start date (YYYY-MM-DD)
 * @param {string} props.toDate - End date (YYYY-MM-DD)
 * @param {(date: string) => void} props.onFromDateChange - Handler for from date changes
 * @param {(date: string) => void} props.onToDateChange - Handler for to date changes
 * @param {() => void} [props.onClear] - Handler for clearing/resetting date range
 * @returns {JSX.Element} DateRangeFilter component
 */
const DateRangeFilter = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onClear,
}) => {
  return (
    <div className="date-range-filter">
      <div className="date-input-group">
        <label htmlFor="fromDate">From:</label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
        />
      </div>
      <div className="date-input-group">
        <label htmlFor="toDate">To:</label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
        />
      </div>
      {onClear && (
        <button type="button" className="clear-btn" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
};

DateRangeFilter.propTypes = {
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  onFromDateChange: PropTypes.func.isRequired,
  onToDateChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
};

export default DateRangeFilter;