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

const ITEMS_PER_PAGE = 5;

const TransactionsTable = ({ data }) => {
  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");

  // Filter data
  const filteredData = data.filter((transaction) =>
    transaction.customerName.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    let valueA = a[orderBy];
    let valueB = b[orderBy];

    if (orderBy === "date") {
      valueA = new Date(a.date);
      valueB = new Date(b.date);
    }

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter]);

  return (
    <div>
      {/* Filter bar */}
      <div className="filters-container">
        <FilterBar
          filterValue={nameFilter}
          onFilterChange={setNameFilter}
          placeholder="Filter by customer name..."
        />
      </div>

      {/* Transactions table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { id: "id", label: "Transaction ID" },
                { id: "customerName", label: "Customer Name" },
                { id: "date", label: "Purchase Date" },
                { id: "product", label: "Product Purchased" },
                { id: "amount", label: "Price" },
                { id: "points", label: "Reward Points" },
              ].map((col) => (
                <TableCell key={col.id}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {currentItems.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.customerName}</TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.product}</TableCell>
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
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

TransactionsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      product: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      points: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TransactionsTable;