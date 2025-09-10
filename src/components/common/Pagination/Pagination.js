import React from "react";
import PropTypes from "prop-types";
import { Button, Stack } from "@mui/material";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const safeOnPageChange = (page) => {
    if (typeof onPageChange === "function" && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate a window of pages (so it doesn't overflow UI)
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // number of buttons visible at once
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 2, flexWrap: "wrap" }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={() => safeOnPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>

      {generatePageNumbers().map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "contained" : "outlined"}
          size="small"
          onClick={() => safeOnPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outlined"
        size="small"
        onClick={() => safeOnPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </Stack>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;