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

// ✅ Sample data updated with customerId and product
const sampleData = [
  { id: "1", customerName: "Alice", date: "2023-05-01", product: "Laptop", amount: 120, points: 10 },
  { id: "2", customerName: "Bob", date: "2023-06-15", product: "Mouse", amount: 80, points: 20 },
  { id: "3", customerName: "Charlie", date: "2023-07-20", product: "Keyboard", amount: 200, points: 30 },
  { id: "4", customerName: "David", date: "2023-08-10", product: "Monitor", amount: 150, points: 40 },
  { id: "5", customerName: "Eve", date: "2023-09-05", product: "Printer", amount: 90, points: 50 },
  { id: "6", customerName: "Frank", date: "2023-10-01", product: "Webcam", amount: 300, points: 60 },
];

describe("TransactionsTable", () => {
  test("renders updated table headers", () => {
    render(<TransactionsTable data={sampleData} />);
    expect(screen.getByText("Transaction ID")).toBeInTheDocument();
    expect(screen.getByText("Customer Name")).toBeInTheDocument();
    expect(screen.getByText("Purchase Date")).toBeInTheDocument();
    expect(screen.getByText("Product Purchased")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();
  });

  test("renders first page with 5 transactions (default date-desc)", () => {
    render(<TransactionsTable data={sampleData} />);
    // 1 header row + 5 data rows
    expect(screen.getAllByRole("row")).toHaveLength(6);
    // Newest (Frank) should be visible by default
    expect(screen.getByText("Frank")).toBeInTheDocument();
    expect(screen.getByText("Webcam")).toBeInTheDocument(); // Product check
  });

  test("navigates to second page with pagination (shows Alice only)", () => {
    render(<TransactionsTable data={sampleData} />);
    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.queryByText("Frank")).not.toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // header + Alice
  });

  test("filters transactions by customer name", () => {
    render(<TransactionsTable data={sampleData} />);
    const filterInput = screen.getByTestId("filter-bar");

    fireEvent.change(filterInput, { target: { value: "Bob" } });

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  test("sorts by Price ascending when clicking Price header", () => {
    render(<TransactionsTable data={sampleData} />);
    const priceHeader = screen.getByText("Price");

    // Click once = asc
    fireEvent.click(priceHeader);

    const rowsAsc = screen.getAllByRole("row").slice(1); // skip header

    // Page 1 should contain: Bob(80), Eve(90), Alice(120), David(150), Charlie(200)
    expect(rowsAsc[0]).toHaveTextContent("Bob");
    expect(rowsAsc[0]).toHaveTextContent("Mouse");

    expect(rowsAsc[rowsAsc.length - 1]).toHaveTextContent("Charlie");
    expect(screen.queryByText("Frank")).not.toBeInTheDocument();
  });

  test("sorts by Price descending when clicking Price header twice", () => {
    render(<TransactionsTable data={sampleData} />);
    const priceHeader = screen.getByText("Price");

    // Click twice = desc
    fireEvent.click(priceHeader);
    fireEvent.click(priceHeader);

    const rowsDesc = screen.getAllByRole("row").slice(1); // skip header

    // Page 1 should contain: Frank(300), Charlie(200), David(150), Alice(120), Eve(90)
    expect(rowsDesc[0]).toHaveTextContent("Frank");
    expect(rowsDesc[0]).toHaveTextContent("Webcam");

    expect(rowsDesc[rowsDesc.length - 1]).toHaveTextContent("Eve");
    expect(rowsDesc[rowsDesc.length - 1]).toHaveTextContent("Printer");
  });
});