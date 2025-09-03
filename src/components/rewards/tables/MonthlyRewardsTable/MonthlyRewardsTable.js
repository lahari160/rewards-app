import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FilterBar from '../../filters/FilterBar/FilterBar';
import Pagination from '../../../common/Pagination/Pagination';

/**
 * Number of reward entries to display per page
 * @constant {number}
 */

const ITEMS_PER_PAGE = 5;

/**
 * Component for displaying monthly rewards data in a filterable table with pagination
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of monthly reward objects to display
 * @returns {JSX.Element} Rendered component
 */
const MonthlyRewardsTable = ({ data }) => {
  // State for filtering and pagination
  const [nameFilter, setNameFilter] = useState(''); // Filter by customer name
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  // Filter data by customer name (case insensitive)
  const filteredData = data.filter(reward => 
    reward.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // Pagination logic - calculate which items to show on current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  /**
   * Formats month and year numbers into a readable string (e.g., "January 2023")
   * @param {number} month - Month number (1-12)
   * @param {number} year - Year (e.g., 2023)
   * @returns {string} Formatted month and year
   */
  const formatMonthYear = (month, year) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Reset to first page when filter changes to avoid empty pages
  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter]);

  return (
    <div>
      <div className="filters-container">
        <FilterBar
          filterValue={nameFilter}
          onFilterChange={setNameFilter}
          placeholder="Filter by customer name..."
        />
      </div>
      <div className="table-container">
        <table className="rewards-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Period</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((reward) => (
              <tr key={`${reward.customerId}-${reward.month}-${reward.year}`}>
                <td>{reward.customerId}</td>
                <td>{reward.customerName}</td>
                <td>{formatMonthYear(reward.month, reward.year)}</td>
                <td>{reward.rewardPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

MonthlyRewardsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      customerName: PropTypes.string.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired
    })
  ).isRequired
};

export default MonthlyRewardsTable;