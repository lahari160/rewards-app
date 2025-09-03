import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FilterBar from '../../filters/FilterBar/FilterBar';
import Pagination from '../../../common/Pagination/Pagination';

const ITEMS_PER_PAGE = 5;

const MonthlyRewardsTable = ({ data }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter(reward => 
    reward.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const formatMonthYear = (month, year) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

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