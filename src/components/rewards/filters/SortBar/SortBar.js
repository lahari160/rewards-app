import React from 'react';

const SortBar = ({ sortOrder, onSortChange }) => {
  return (
    <div className="sort-bar">
      <label>
        Sort by:
        <select 
          value={sortOrder} 
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="date-desc">Purchase Date (Newest First)</option>
          <option value="date-asc">Purchase Date (Oldest First)</option>
          <option value="amount-desc">Price (High to Low)</option>
          <option value="amount-asc">Price (Low to High)</option>
          <option value="points-desc">Reward Points (High to Low)</option>
          <option value="points-asc">Reward Points (Low to High)</option>
        </select>
      </label>
    </div>
  );
};

export default SortBar;