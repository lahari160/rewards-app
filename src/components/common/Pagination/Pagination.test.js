import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      currentPage: 1,
      totalItems: 50,
      itemsPerPage: 5,
      onPageChange: jest.fn(),
    };
    return render(<Pagination {...defaultProps} {...props} />);
  };

  test("renders correct number of page buttons", () => {
    setup();
    // Should render 5 page buttons because of maxVisible=5
    const pageButtons = screen.getAllByRole("button", { name: /^[0-9]+$/ });
    expect(pageButtons).toHaveLength(5);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
  });

  test("disables Prev button on first page", () => {
    setup({ currentPage: 1 });
    const prevButton = screen.getByRole("button", { name: "Prev" });
    expect(prevButton).toBeDisabled();
  });

  test("disables Next button on last page", () => {
    setup({ currentPage: 10 }); // 50 items / 5 per page = 10 pages
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeDisabled();
  });

  test("calls onPageChange when clicking a page number", () => {
    const onPageChange = jest.fn();
    setup({ onPageChange });
    const page2Button = screen.getByRole("button", { name: "2" });
    fireEvent.click(page2Button);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange when clicking Next", () => {
    const onPageChange = jest.fn();
    setup({ currentPage: 1, onPageChange });
    const nextButton = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange when clicking Prev", () => {
    const onPageChange = jest.fn();
    setup({ currentPage: 3, onPageChange });
    const prevButton = screen.getByRole("button", { name: "Prev" });
    fireEvent.click(prevButton);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test("renders nothing when total pages <= 1", () => {
    const { container } = setup({ totalItems: 4, itemsPerPage: 5 });
    expect(container.firstChild).toBeNull();
  });
});