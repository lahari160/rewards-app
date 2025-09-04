// TotalRewardsTable.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TotalRewardsTable from "./TotalRewardsTable";

// Mock child components
jest.mock("../../filters/FilterBar/FilterBar", () => ({ filterValue, onFilterChange, placeholder }) => (
  <input
    data-testid="filter-bar"
    placeholder={placeholder}
    value={filterValue}
    onChange={(e) => onFilterChange(e.target.value)}
  />
));

jest.mock("../../../common/Pagination/Pagination", () => ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <div data-testid="pagination">
      <span>Page {currentPage} of {totalPages}</span>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i+1} onClick={() => onPageChange(i+1)}>{i+1}</button>
      ))}
    </div>
  );
});

const sampleData = [
  { customerId: 1, customerName: "Alice", rewardPoints: 100 },
  { customerId: 2, customerName: "Bob", rewardPoints: 200 },
  { customerId: 3, customerName: "Charlie", rewardPoints: 300 },
  { customerId: 4, customerName: "David", rewardPoints: 400 },
  { customerId: 5, customerName: "Eve", rewardPoints: 500 },
  { customerId: 6, customerName: "Frank", rewardPoints: 600 }
];

describe("TotalRewardsTable", () => {
  test("shows message when no data is provided", () => {
    render(<TotalRewardsTable data={[]} />);
    expect(screen.getByText("No total rewards data available")).toBeInTheDocument();
  });

  test("renders table headers and first page of data", () => {
    render(<TotalRewardsTable data={sampleData} />);
    expect(screen.getByText("Customer ID")).toBeInTheDocument();
    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    expect(screen.getByText("Total Reward Points")).toBeInTheDocument();

    // 1 header row + 5 data rows
    expect(screen.getAllByRole("row")).toHaveLength(6);
  });

  test("navigates to second page using pagination", async () => {
    render(<TotalRewardsTable data={sampleData} />);
    const page2Button = screen.getByRole("button", { name: "2" });
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(screen.getByText("Frank")).toBeInTheDocument();
    });

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(2); // 1 header row + Frank
  });

  test("filters data by customer name", () => {
    render(<TotalRewardsTable data={sampleData} />);
    const filterInput = screen.getByTestId("filter-bar");

    fireEvent.change(filterInput, { target: { value: "Bob" } });

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // header + Bob
  });
});
