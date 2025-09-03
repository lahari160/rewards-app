import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FilterBar from '../../filters/FilterBar/FilterBar';
import Pagination from '../../../common/Pagination/Pagination';

const ITEMS_PER_PAGE = 5;

const TotalRewardsTable = ({ data }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return <p>No total rewards data available</p>;
  }

  const filteredData = data.filter(reward =>
    reward.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // Pagination logic
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