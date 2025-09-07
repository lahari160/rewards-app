import React, { useState } from "react";
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
 * Component for displaying total rewards data
 * in a filterable, sortable table with pagination.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of total reward objects to display
 * @returns {JSX.Element} Rendered component
 */
const TotalRewardsTable = ({ data }) => {
  const [nameFilter, setNameFilter] = useState(""); // Filter by customer name
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  // Sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("customerName");

  if (!data || data.length === 0) {
    return <p>No total rewards data available</p>;
  }

  // Filter data by customer name
  const filteredData = data.filter((reward) =>
    reward.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // Sorting logic
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const valueA = a[orderBy];
    const valueB = b[orderBy];
    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastReward = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstReward = indexOfLastReward - ITEMS_PER_PAGE;
  const currentRewards = sortedData.slice(indexOfFirstReward, indexOfLastReward);

  return (
    <div>
      <FilterBar
        filterValue={nameFilter}
        onFilterChange={setNameFilter}
        placeholder="Filter by customer name..."
      />

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
                  active={orderBy === "rewardPoints"}
                  direction={orderBy === "rewardPoints" ? order : "asc"}
                  onClick={() => handleSort("rewardPoints")}
                >
                  Total Reward Points
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRewards.map((reward) => (
              <TableRow key={reward.customerId}>
                <TableCell>{reward.customerId}</TableCell>
                <TableCell>{reward.customerName}</TableCell>
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

TotalRewardsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      customerName: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TotalRewardsTable;
