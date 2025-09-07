import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  const defaultProps = {
    message: 'Test error message',
    onRetry: jest.fn()
  };

  beforeEach(() => {
    // Clear mock function calls before each test
    defaultProps.onRetry.mockClear();
  });

  it('renders error message correctly', () => {
    render(<ErrorMessage {...defaultProps} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls onRetry when Try Again button is clicked', () => {
    render(<ErrorMessage {...defaultProps} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    
    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders with custom message', () => {
    const customMessage = 'Custom error occurred';
    render(<ErrorMessage message={customMessage} onRetry={defaultProps.onRetry} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders without retry button when onRetry is not provided', () => {
    render(<ErrorMessage message={defaultProps.message} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies error-container class', () => {
  render(<ErrorMessage {...defaultProps} />);
  expect(screen.getByTestId("error-container")).toHaveClass("error-container");
});

});