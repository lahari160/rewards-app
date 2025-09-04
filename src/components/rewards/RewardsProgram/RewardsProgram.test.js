// RewardsProgram.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import RewardsProgram from "./RewardsProgram";

// Mock child components so we don't need their implementations
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

jest.mock("../filters/DataRangeFilter/DateRangeFilter", () => () => (
  <div data-testid="date-range-filter" />
));

jest.mock("../filters/FilterBar/FilterBar", () => () => (
  <input data-testid="filter-bar" />
));

// Mock the custom hook
const mockLoadData = jest.fn();
jest.mock("../../../hooks/UserRewardsData/useRewardsData", () => jest.fn());

import useRewardsData from "../../../hooks/UserRewardsData/useRewardsData";

describe("RewardsProgram", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading spinner when loading", () => {
    useRewardsData.mockReturnValue({
      isLoading: true,
      error: null,
    });

    render(<RewardsProgram />);
    expect(screen.getByTestId("loading-spinner")).toHaveTextContent("Loading transactions data...");
  });

  test("shows error message when error exists", () => {
    useRewardsData.mockReturnValue({
      isLoading: false,
      error: "Something went wrong",
      loadData: mockLoadData,
    });

    render(<RewardsProgram />);
    expect(screen.getByTestId("error-message")).toHaveTextContent("Something went wrong");

    // test retry button
    fireEvent.click(screen.getByText("Retry"));
    expect(mockLoadData).toHaveBeenCalled();
  });

  test("renders rewards tables when data is loaded", () => {
    useRewardsData.mockReturnValue({
      isLoading: false,
      error: null,
      filteredTransactions: [{ id: 1 }],
      filteredMonthlyRewards: [{ month: "Jan", points: 100 }],
      filteredTotalRewards: [{ total: 200 }],
      fromDate: "2024-01-01",
      toDate: "2024-02-01",
      nameFilter: "",
      setFromDate: jest.fn(),
      setToDate: jest.fn(),
      setNameFilter: jest.fn(),
      loadData: mockLoadData,
    });

    render(<RewardsProgram />);
    expect(screen.getByText("Customer Rewards Program")).toBeInTheDocument();
    expect(screen.getByTestId("monthly-table")).toHaveTextContent("Monthly: 1");
    expect(screen.getByTestId("total-table")).toHaveTextContent("Total: 1");
    expect(screen.getByTestId("transactions-table")).toHaveTextContent("Transactions: 1");

    // test refresh button
    fireEvent.click(screen.getByText("Refresh Data"));
    expect(mockLoadData).toHaveBeenCalled();
  });
});
