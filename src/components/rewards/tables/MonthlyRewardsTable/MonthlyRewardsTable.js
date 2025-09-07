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
 * Number of reward entries to display per page
 * @constant {number}
 */
const ITEMS_PER_PAGE = 5;

/**
 * Component for displaying monthly rewards data
 * in a filterable, sortable table with pagination.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of monthly reward objects to display
 * @returns {JSX.Element} Rendered component
 */
const MonthlyRewardsTable = ({ data }) => {
  // State for filtering and pagination
  const [nameFilter, setNameFilter] = useState(""); // Filter by customer name
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  // State for sorting
  const [order, setOrder] = useState("asc"); // Sorting order: 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState("customerName"); // Column being sorted

  /**
   * Filters data by customer name (case insensitive).
   * @type {Array<Object>}
   */
  const filteredData = data.filter((reward) =>
    reward.customerName.toLowerCase().includes(nameFilter.toLowerCase())
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
   * Returns sorted version of filtered data based on order and orderBy state.
   * @type {Array<Object>}
   */
  const sortedData = [...filteredData].sort((a, b) => {
    let valueA = a[orderBy];
    let valueB = b[orderBy];

    // Special case for "period" column (month + year combined)
    if (orderBy === "period") {
      valueA = new Date(a.year, a.month - 1);
      valueB = new Date(b.year, b.month - 1);
    }

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });

  /**
   * Pagination logic - calculate which items to show on current page
   * @type {Array<Object>}
   */
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  /**
   * Formats month and year numbers into a readable string (e.g., "January 2023").
   *
   * @param {number} month - Month number (1-12)
   * @param {number} year - Year (e.g., 2023)
   * @returns {string} Formatted month and year
   */
  const formatMonthYear = (month, year) => {
  const date = new Date(year, month - 1, 1); // Use day=1
  const day = String(date.getDate()).padStart(2, "0");
  const mon = String(date.getMonth() + 1).padStart(2, "0");
  const yr = date.getFullYear();
  return `${day}-${mon}-${yr}`;
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

      {/* Rewards Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customerId"}
                  direction={orderBy === "customerId" ? order : "asc"}
                  onClick={() => handleSort("customerId")}
                >
                  Customer ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customerName"}
                  direction={orderBy === "customerName" ? order : "asc"}
                  onClick={() => handleSort("customerName")}
                >
                  Customer Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "period"}
                  direction={orderBy === "period" ? order : "asc"}
                  onClick={() => handleSort("period")}
                >
                  Period
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "rewardPoints"}
                  direction={orderBy === "rewardPoints" ? order : "asc"}
                  onClick={() => handleSort("rewardPoints")}
                >
                  Reward Points
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentItems.map((reward) => (
              <TableRow
                key={`${reward.customerId}-${reward.month}-${reward.year}`}
              >
                <TableCell>{reward.customerId}</TableCell>
                <TableCell>{reward.customerName}</TableCell>
                <TableCell>{formatMonthYear(reward.month, reward.year)}</TableCell>
                <TableCell>{reward.rewardPoints}</TableCell>
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

MonthlyRewardsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      customerName: PropTypes.string.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MonthlyRewardsTable;