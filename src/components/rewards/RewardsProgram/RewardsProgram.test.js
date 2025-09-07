// RewardsProgram.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RewardsProgram from "./RewardsProgram";
import useRewardsData from "../../../hooks/UserRewardsData/useRewardsData";

// -------------------------
// Mocks for child components
// -------------------------
jest.mock("../../common/LoadingSpinner/LoadingSpinner", () => ({ message }) => (
  <div data-testid="loading-spinner">{message}</div>
));

jest.mock("../../common/ErrorMessage/ErrorMessage", () => ({ message, onRetry }) => (
  <div data-testid="error-message">
    {message}
    <button onClick={onRetry}>Retry</button>
  </div>
));

jest.mock("../../rewards/tables/TransactionsTable/TransactionsTable", () => ({ data }) => (
  <div data-testid="transactions-table">Transactions: {data?.length || 0}</div>
));

jest.mock("../../rewards/tables/MonthlyRewardsTable/MonthlyRewardsTable", () => ({ data }) => (
  <div data-testid="monthly-table">Monthly: {data?.length || 0}</div>
));

jest.mock("../../rewards/tables/TotalRewardsTable/TotalRewardsTable", () => ({ data }) => (
  <div data-testid="total-table">Total: {data?.length || 0}</div>
));

jest.mock("../filters/DataRangeFilter/DateRangeFilter", () => ({ onClear }) => (
  <div data-testid="date-range-filter">
    <button onClick={onClear}>Clear Dates</button>
  </div>
));

jest.mock("../filters/FilterBar/FilterBar", () => ({ filterValue, onFilterChange }) => (
  <input
    data-testid="filter-bar"
    value={filterValue}
    onChange={(e) => onFilterChange(e.target.value)}
  />
));

// -------------------------
// Mock the custom hook
// -------------------------
jest.mock("../../../hooks/UserRewardsData/useRewardsData");

const mockLoadData = jest.fn();

// ✅ Base mock with full shape of hook return
const baseMock = {
  filteredTransactions: [],
  filteredMonthlyRewards: [],
  filteredTotalRewards: [],
  fromDate: "",
  toDate: "",
  nameFilter: "",
  isLoading: false,
  error: null,
  setFromDate: jest.fn(),
  setToDate: jest.fn(),
  setNameFilter: jest.fn(),
  loadData: mockLoadData,
};

describe("RewardsProgram", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading spinner when loading", () => {
    useRewardsData.mockReturnValue({
      ...baseMock,
      isLoading: true,
      error: null,
    });

    render(<RewardsProgram />);
    expect(screen.getByTestId("loading-spinner")).toHaveTextContent(
      "Loading transactions data..."
    );
  });

  test("shows error message when error exists", () => {
    useRewardsData.mockReturnValue({
      ...baseMock,
      isLoading: false,
      error: "Something went wrong",
    });

    render(<RewardsProgram />);
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Something went wrong"
    );

    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(mockLoadData).toHaveBeenCalled();
  });
});