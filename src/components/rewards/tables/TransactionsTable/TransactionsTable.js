import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FilterBar from "../../filters/FilterBar/FilterBar";
import Pagination from "../../../common/Pagination/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";

/**
 * Number of transactions to display per page
 * @constant {number}
 */
const ITEMS_PER_PAGE = 5;

/**
 * Component for displaying transaction data
 * in a filterable, sortable table with pagination.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of transaction objects to display
 * @returns {JSX.Element} Rendered component
 */
const TransactionsTable = ({ data }) => {
  // State for sorting, filtering, and pagination
  const [nameFilter, setNameFilter] = useState(""); // Filter by customer name
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [order, setOrder] = useState("desc"); // Sort order
  const [orderBy, setOrderBy] = useState("date"); // Sort column

  /**
   * Filters data by customer name (case insensitive).
   * @type {Array<Object>}
   */
  const filteredData = data.filter((transaction) =>
    transaction.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );

  /**
   * Handles sorting logic when a column header is clicked.
   * @param {string} property - Column name to sort by
   */
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /**
   * Sorts filtered data by selected column and order.
   * @type {Array<Object>}
   */
  const sortedData = [...filteredData].sort((a, b) => {
    let valueA = a[orderBy];
    let valueB = b[orderBy];

    // Convert date strings to Date objects for comparison
    if (orderBy === "date") {
      valueA = new Date(a.date);
      valueB = new Date(b.date);
    }

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });

  /**
   * Pagination logic - slice sorted data for current page.
   * @type {Array<Object>}
   */
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filter changes
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

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleSort("id")}
                >
                  Transaction ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={() => handleSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customerName"}
                  direction={orderBy === "customerName" ? order : "asc"}
                  onClick={() => handleSort("customerName")}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "points"}
                  direction={orderBy === "points" ? order : "asc"}
                  onClick={() => handleSort("points")}
                >
                  Points
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentItems.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.customerName}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
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
