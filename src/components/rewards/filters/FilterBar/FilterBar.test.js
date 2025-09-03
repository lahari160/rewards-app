import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterBar from '../FilterBar/FilterBar';

describe('FilterBar', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders with placeholder text', () => {
    render(
      <FilterBar 
        filterValue="" 
        onFilterChange={mockOnChange}
        placeholder="Test placeholder"
      />
    );
    
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  test('displays current filter value', () => {
    render(
      <FilterBar 
        filterValue="test" 
        onFilterChange={mockOnChange}
        placeholder="Search..."
      />
    );
    
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  test('calls onFilterChange when input changes', () => {
    render(
      <FilterBar 
        filterValue="" 
        onFilterChange={mockOnChange}
        placeholder="Search..."
      />
    );
    
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'new value' }
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });
});