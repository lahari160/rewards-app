import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default loading message', () => {
    render(<LoadingSpinner />);

    // Query by text for the loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Query by test ID for container
    expect(screen.getByTestId('loading-container')).toHaveClass('loading-container');
  });

  it('renders with custom message', () => {
    const customMessage = 'Please wait...';
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    render(<LoadingSpinner />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<LoadingSpinner />);

    const container = screen.getByTestId('loading-container');
    const spinner = screen.getByTestId('spinner');

    expect(container).toHaveClass('loading-container');
    expect(spinner).toBeInTheDocument();
  });
});