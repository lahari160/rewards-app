// SortBar.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import SortBar from "./SortBar";

describe("SortBar Component", () => {
  test("renders all sort options", () => {
    render(<SortBar sortOrder="date-desc" onSortChange={() => {}} />);

    // Check label
    expect(screen.getByText(/Sort by:/i)).toBeInTheDocument();

    // Check all options
    expect(screen.getByText("Purchase Date (Newest First)")).toBeInTheDocument();
    expect(screen.getByText("Purchase Date (Oldest First)")).toBeInTheDocument();
    expect(screen.getByText("Price (High to Low)")).toBeInTheDocument();
    expect(screen.getByText("Price (Low to High)")).toBeInTheDocument();
    expect(screen.getByText("Reward Points (High to Low)")).toBeInTheDocument();
    expect(screen.getByText("Reward Points (Low to High)")).toBeInTheDocument();
  });

  test("shows the correct selected value", () => {
    render(<SortBar sortOrder="amount-desc" onSortChange={() => {}} />);
    const select = screen.getByRole("combobox");
    expect(select.value).toBe("amount-desc");
  });

  test("calls onSortChange when a new option is selected", () => {
    const mockOnSortChange = jest.fn();
    render(<SortBar sortOrder="date-desc" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "points-asc" } });

    expect(mockOnSortChange).toHaveBeenCalledWith("points-asc");
  });
});