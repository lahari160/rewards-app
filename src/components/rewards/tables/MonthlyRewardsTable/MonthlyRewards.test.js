// MonthlyRewardsTable.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import MonthlyRewardsTable from "./MonthlyRewardsTable";
import { waitFor } from "@testing-library/react"; 
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
  { customerId: 1, customerName: "Alice", month: 1, year: 2023, rewardPoints: 100 },
  { customerId: 2, customerName: "Bob", month: 2, year: 2023, rewardPoints: 150 },
  { customerId: 3, customerName: "Charlie", month: 3, year: 2023, rewardPoints: 200 },
  { customerId: 4, customerName: "David", month: 4, year: 2023, rewardPoints: 250 },
  { customerId: 5, customerName: "Eve", month: 5, year: 2023, rewardPoints: 300 },
  { customerId: 6, customerName: "Frank", month: 6, year: 2023, rewardPoints: 350 }
];

describe("MonthlyRewardsTable", () => {
  test("renders table headers", () => {
    render(<MonthlyRewardsTable data={sampleData} />);
    expect(screen.getByText("Customer ID")).toBeInTheDocument();
    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    expect(screen.getByText("Period")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();
  });

  test("renders first page of data (5 items)", () => {
    render(<MonthlyRewardsTable data={sampleData} />);
    expect(screen.getAllByRole("row")).toHaveLength(6); // 1 header row + 5 data rows
  });

  test("navigates to second page using pagination", async () => {
  render(<MonthlyRewardsTable data={sampleData} />);

  // Find the pagination button with name "2"
  const page2Button = screen.getByRole("button", { name: "2" });
  fireEvent.click(page2Button);

  // Wait for Frank to appear
  await waitFor(() => {
    expect(screen.getByText("Frank")).toBeInTheDocument();
  });

  // Now assert row count (header + 1 row)
  const rows = screen.getAllByRole("row");
  expect(rows).toHaveLength(2);
});


  test("filters data by customer name", () => {
    render(<MonthlyRewardsTable data={sampleData} />);
    const filterInput = screen.getByTestId("filter-bar");

    // Type "Bob"
    fireEvent.change(filterInput, { target: { value: "Bob" } });

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // header + Bob
  });

  test("formats month and year correctly", () => {
    render(<MonthlyRewardsTable data={[sampleData[0]]} />);
    expect(screen.getByText("January 2023")).toBeInTheDocument();
  });
});
