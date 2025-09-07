import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container" data-testid="loading-container">
  <div className="spinner" data-testid="spinner"></div>
  <p>{message || 'Loading...'}</p>
</div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string
};

export default LoadingSpinner;