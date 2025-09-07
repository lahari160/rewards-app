import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DateRangeFilter from '../DataRangeFilter/DateRangeFilter';

describe('DateRangeFilter', () => {
  const mockFromDateChange = jest.fn();
  const mockToDateChange = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders from and to date inputs', () => {
    render(
      <DateRangeFilter
        fromDate="2023-01-01"
        toDate="2023-12-31"
        onFromDateChange={mockFromDateChange}
        onToDateChange={mockToDateChange}
      />
    );

    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
  });

  test('displays current date values', () => {
    render(
      <DateRangeFilter
        fromDate="2023-01-01"
        toDate="2023-12-31"
        onFromDateChange={mockFromDateChange}
        onToDateChange={mockToDateChange}
      />
    );

    expect(screen.getByLabelText(/from/i)).toHaveValue('2023-01-01');
    expect(screen.getByLabelText(/to/i)).toHaveValue('2023-12-31');
  });

  test('calls onChange handlers when dates change', () => {
    render(
      <DateRangeFilter
        fromDate=""
        toDate=""
        onFromDateChange={mockFromDateChange}
        onToDateChange={mockToDateChange}
      />
    );

    fireEvent.change(screen.getByLabelText(/from/i), {
      target: { value: '2023-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/to/i), {
      target: { value: '2023-12-31' },
    });

    expect(mockFromDateChange).toHaveBeenCalledWith('2023-01-01');
    expect(mockToDateChange).toHaveBeenCalledWith('2023-12-31');
  });

  test('renders and triggers clear button if onClear is provided', () => {
    render(
      <DateRangeFilter
        fromDate="2023-01-01"
        toDate="2023-12-31"
        onFromDateChange={mockFromDateChange}
        onToDateChange={mockToDateChange}
        onClear={mockOnClear}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});