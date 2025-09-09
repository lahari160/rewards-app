import React from 'react';
import PropTypes from 'prop-types';
import Logger from '../../../services/logger/logger';

/**
 * Error Boundary component to catch and handle React component errors.
 * Logs errors using the Logger service and provides a fallback UI with
 * an option to reload the page.
 *
 * @component
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} ErrorBoundary wrapper component
 */
class ErrorBoundary extends React.Component {
  /**
   * Creates an instance of ErrorBoundary.
   *
   * @param {Object} props - Component props
   */
  constructor(props) {
    super(props);
    /**
     * @property {boolean} hasError - Whether an error has been caught
     * @property {Error|null} error - The error object, if any
     * @property {React.ErrorInfo|null} errorInfo - Additional error info
     */
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Updates state when an error is thrown in a child component.
   *
   * @param {Error} error - The error object
   * @returns {Object} New state with hasError set to true
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Logs error details and updates component state.
   *
   * @param {Error} error - The error thrown
   * @param {React.ErrorInfo} errorInfo - React error information object
   * @returns {void}
   */
  componentDidCatch(error, errorInfo) {
    Logger.error('React component error caught by ErrorBoundary', {
      error,
      errorInfo,
      component: errorInfo.componentStack
    });
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  /**
   * Renders fallback UI if an error has been caught, otherwise renders children.
   *
   * @returns {JSX.Element} Fallback UI or child components
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{this.state.error && this.state.error.toString()}</pre>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components wrapped by the ErrorBoundary */
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;