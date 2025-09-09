import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable loading spinner component with an optional message.
 *
 * @component
 * @example
 * // Default usage
 * <LoadingSpinner />
 *
 * @example
 * // With custom message
 * <LoadingSpinner message="Fetching data..." />
 *
 * @param {Object} props - Component props
 * @param {string} [props.message='Loading...'] - Optional loading message to display below the spinner
 * @returns {JSX.Element} The loading spinner with a message
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container" data-testid="loading-container">
      <div className="spinner" data-testid="spinner"></div>
      <p>{message || 'Loading...'}</p>
    </div>
  );
};

LoadingSpinner.propTypes = {
  /** Optional loading message to display below the spinner */
  message: PropTypes.string
};

export default LoadingSpinner;