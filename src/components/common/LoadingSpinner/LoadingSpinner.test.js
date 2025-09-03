import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default loading message', () => {
    const { container } = render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('loading-container');
  });

  it('renders with custom message', () => {
    const customMessage = 'Please wait...';
    render(<LoadingSpinner message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(<LoadingSpinner />);
    
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<LoadingSpinner />);
    
    expect(container.firstChild).toHaveClass('loading-container');
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});