import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalItems: 30,
    itemsPerPage: 10,
    onPageChange: jest.fn()
  };

  beforeEach(() => {
    defaultProps.onPageChange.mockClear();
  });

  it('renders pagination buttons correctly', () => {
    render(<Pagination {...defaultProps} />);
    
    // Should show 3 page buttons (30 items / 10 per page)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    expect(screen.getByText('Previous')).not.toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onPageChange when clicking page numbers', () => {
    render(<Pagination {...defaultProps} />);
    
    fireEvent.click(screen.getByText('2'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking Next', () => {
    render(<Pagination {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking Previous', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    
    fireEvent.click(screen.getByText('Previous'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    
    expect(screen.getByText('2')).toHaveClass('active');
    expect(screen.getByText('1')).not.toHaveClass('active');
  });

  it('does not render when total pages is 1', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalItems={10} />
    );
    
    expect(container.firstChild).toBeNull();
  });
});