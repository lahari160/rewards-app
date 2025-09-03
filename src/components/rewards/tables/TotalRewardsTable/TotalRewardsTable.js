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
 * Component for displaying total rewards data in a filterable table with pagination
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of total reward objects to display
 * @returns {JSX.Element} Rendered component
 */
const TotalRewardsTable = ({ data }) => {
  // State for filtering and pagination
  const [nameFilter, setNameFilter] = useState(''); // Filter by customer name
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  // Show message if no data is available
  if (!data || data.length === 0) {
    return <p>No total rewards data available</p>;
  }

  // Filter data by customer name (case insensitive)
  const filteredData = data.filter(reward =>
    reward.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // Pagination logic - calculate which items to show on current page
  const indexOfLastReward = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstReward = indexOfLastReward - ITEMS_PER_PAGE;
  const currentRewards = filteredData.slice(indexOfFirstReward, indexOfLastReward);

  return (
    <div>
      <FilterBar
        filterValue={nameFilter}
        onFilterChange={setNameFilter}
        placeholder="Filter by customer name..."
      />
      <div className="table-container">
        <table className="rewards-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Total Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {currentRewards.map((reward) => (
              <tr key={reward.customerId}>
                <td>{reward.customerId}</td>
                <td>{reward.customerName}</td>
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

TotalRewardsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      customerName: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TotalRewardsTable;