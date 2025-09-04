// TransactionsTable.test.js
import { render, screen, fireEvent } from "@testing-library/react";

// ✅ Mock sortTransactions BEFORE importing the component (so default + changes are predictable)
jest.mock("../../../../utils/processData/processData", () => ({
  sortTransactions: (data, sortOrder) => {
    if (sortOrder === "amount-asc") return [...data].sort((a, b) => a.amount - b.amount);
    if (sortOrder === "amount-desc") return [...data].sort((a, b) => b.amount - a.amount);
    if (sortOrder === "date-asc") return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    // default: date-desc
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}));

import TransactionsTable from "./TransactionsTable";

// Mock SortBar
jest.mock("../../filters/SortBar/SortBar", () => ({ sortOrder, onSortChange }) => (
  <select
    data-testid="sort-bar"
    value={sortOrder}
    onChange={(e) => onSortChange(e.target.value)}
  >
    <option value="date-desc">Date Desc</option>
    <option value="date-asc">Date Asc</option>
    <option value="amount-desc">Amount Desc</option>
    <option value="amount-asc">Amount Asc</option>
  </select>
));

// Mock FilterBar
jest.mock("../../filters/FilterBar/FilterBar", () => ({ filterValue, onFilterChange, placeholder }) => (
  <input
    data-testid="filter-bar"
    placeholder={placeholder}
    value={filterValue}
    onChange={(e) => onFilterChange(e.target.value)}
  />
));

// Mock Pagination
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
  { id: "1", date: "2023-05-01", customerName: "Alice",   amount: 120, points: 10 },
  { id: "2", date: "2023-06-15", customerName: "Bob",     amount: 80,  points: 20 },
  { id: "3", date: "2023-07-20", customerName: "Charlie", amount: 200, points: 30 },
  { id: "4", date: "2023-08-10", customerName: "David",   amount: 150, points: 40 },
  { id: "5", date: "2023-09-05", customerName: "Eve",     amount: 90,  points: 50 },
  { id: "6", date: "2023-10-01", customerName: "Frank",   amount: 300, points: 60 }
];

describe("TransactionsTable", () => {
  test("renders table headers", () => {
    render(<TransactionsTable data={sampleData} />);
    expect(screen.getByText("Transaction ID")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();
  });

  test("renders first page with 5 transactions (default date-desc)", () => {
    render(<TransactionsTable data={sampleData} />);
    // 1 header row + 5 data rows
    expect(screen.getAllByRole("row")).toHaveLength(6);
    // Newest (Frank) should be on page 1 by default
    expect(screen.getByText("Frank")).toBeInTheDocument();
  });

  test("navigates to second page with pagination (shows oldest Alice)", async () => {
    render(<TransactionsTable data={sampleData} />);
    const page2Button = screen.getByRole("button", { name: "2" });
    fireEvent.click(page2Button);

    // After moving to page 2, Alice should be visible and Frank should not
    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Frank")).not.toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(2); // header + Alice
  });

  test("filters transactions by customer name", () => {
    render(<TransactionsTable data={sampleData} />);
    const filterInput = screen.getByTestId("filter-bar");

    fireEvent.change(filterInput, { target: { value: "Bob" } });

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  test("sorts by amount ascending across pages", async () => {
    render(<TransactionsTable data={sampleData} />);
    const sortSelect = screen.getByTestId("sort-bar");

    // amount-asc → page 1 should contain: Bob(80), Eve(90), Alice(120), David(150), Charlie(200)
    fireEvent.change(sortSelect, { target: { value: "amount-asc" } });

    const rowsPage1 = screen.getAllByRole("row").slice(1); // exclude header
    expect(rowsPage1[0]).toHaveTextContent("Bob");       // lowest = 80
    expect(rowsPage1[rowsPage1.length - 1]).toHaveTextContent("Charlie"); // 5th = 200
    expect(screen.queryByText("Frank")).not.toBeInTheDocument(); // Frank(300) should be on page 2

    // Go to page 2 → should show Frank only
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(await screen.findByText("Frank")).toBeInTheDocument();
    const rowsPage2 = screen.getAllByRole("row");
    expect(rowsPage2).toHaveLength(2); // header + Frank
  });
});
