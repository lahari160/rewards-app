import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable error message component with an optional retry button.
 *
 * @component
 * @example
 * // Basic usage
 * <ErrorMessage message="Failed to load data." />
 *
 * @example
 * // With retry action
 * <ErrorMessage
 *   message="Network error. Please try again."
 *   onRetry={() => console.log('Retrying...')}
 * />
 *
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {function} [props.onRetry] - Optional callback function to retry the failed action
 * @returns {JSX.Element} The error message component with optional retry button
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container" data-testid="error-container">
      <h2>Error Loading Data</h2>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Try Again
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  /** The error message text to display */
  message: PropTypes.string.isRequired,
  /** Optional retry callback function triggered on button click */
  onRetry: PropTypes.func
};

export default ErrorMessage;