import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SortBar from '../../filters/SortBar/SortBar';
import FilterBar from '../../filters/FilterBar/FilterBar';
import Pagination from '../../../common/Pagination/Pagination';
import { sortTransactions } from '../../../../utils/processData/processData';

/**
 * Number of transactions to display per page
 * @constant {number}
 */

const ITEMS_PER_PAGE = 5;

/**
 * Component for displaying transaction data in a sortable, filterable table with pagination
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of transaction objects to display
 * @returns {JSX.Element} Rendered component
 */
const TransactionsTable = ({ data }) => {
  // State for table sorting, filtering and pagination
  const [sortOrder, setSortOrder] = useState('date-desc'); // Default sort by date descending
  const [nameFilter, setNameFilter] = useState(''); // Filter by customer name
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  
  // Filter data by customer name (case insensitive)
  const filteredData = data.filter(transaction =>
    transaction.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );
  
  // Sort the filtered data according to current sort order
  const sortedData = sortTransactions(filteredData, sortOrder);

  // Pagination logic - calculate which items to show on current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filter changes to avoid empty pages
  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter]);

  return (
    <div>
      <div className="table-controls">
        <FilterBar
          filterValue={nameFilter}
          onFilterChange={setNameFilter}
          placeholder="Filter by customer name..."
        />
        <SortBar 
          sortOrder={sortOrder} 
          onSortChange={setSortOrder} 
        />
      </div>
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.customerName}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>{transaction.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

TransactionsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      points: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TransactionsTable;