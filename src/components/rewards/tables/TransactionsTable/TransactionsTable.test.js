// TransactionsTable.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsTable from "./TransactionsTable";

// ✅ Mock FilterBar
jest.mock("../../filters/FilterBar/FilterBar", () => ({
  filterValue,
  onFilterChange,
  placeholder,
}) => (
  <input
    data-testid="filter-bar"
    placeholder={placeholder}
    value={filterValue}
    onChange={(e) => onFilterChange(e.target.value)}
  />
));

// ✅ Mock Pagination
jest.mock("../../../common/Pagination/Pagination", () => ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i + 1} onClick={() => onPageChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
});

const sampleData = [
  { id: "1", date: "2023-05-01", customerName: "Alice", amount: 120, points: 10 },
  { id: "2", date: "2023-06-15", customerName: "Bob", amount: 80, points: 20 },
  { id: "3", date: "2023-07-20", customerName: "Charlie", amount: 200, points: 30 },
  { id: "4", date: "2023-08-10", customerName: "David", amount: 150, points: 40 },
  { id: "5", date: "2023-09-05", customerName: "Eve", amount: 90, points: 50 },
  { id: "6", date: "2023-10-01", customerName: "Frank", amount: 300, points: 60 },
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
    // Newest (Frank) should be visible by default
    expect(screen.getByText("Frank")).toBeInTheDocument();
  });

  test("navigates to second page with pagination (shows Alice only)", () => {
    render(<TransactionsTable data={sampleData} />);
    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Frank")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // header + Alice
  });

  test("filters transactions by customer name", () => {
    render(<TransactionsTable data={sampleData} />);
    const filterInput = screen.getByTestId("filter-bar");

    fireEvent.change(filterInput, { target: { value: "Bob" } });

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  test("sorts by Amount ascending when clicking Amount header", () => {
  render(<TransactionsTable data={sampleData} />);
  const amountHeader = screen.getByText("Amount");

  // Click once = asc
  fireEvent.click(amountHeader);

  const rowsAsc = screen.getAllByRole("row").slice(1); // skip header

  // Page 1 should contain: Bob(80), Eve(90), Alice(120), David(150), Charlie(200)
  expect(rowsAsc[0]).toHaveTextContent("Bob");     // lowest = 80
  expect(rowsAsc[rowsAsc.length - 1]).toHaveTextContent("Charlie"); // 5th = 200

  // Frank(300) is on page 2, not on page 1
  expect(screen.queryByText("Frank")).not.toBeInTheDocument();
});

test("sorts by Amount descending when clicking Amount header twice", () => {
  render(<TransactionsTable data={sampleData} />);
  const amountHeader = screen.getByText("Amount");

  // Click twice = desc
  fireEvent.click(amountHeader);
  fireEvent.click(amountHeader);

  const rowsDesc = screen.getAllByRole("row").slice(1); // skip header

  // Page 1 should contain: Frank(300), Charlie(200), David(150), Alice(120), Eve(90)
  expect(rowsDesc[0]).toHaveTextContent("Frank"); // highest = 300
  expect(rowsDesc[rowsDesc.length - 1]).toHaveTextContent("Eve"); // lowest on page 1 = 90
});

});