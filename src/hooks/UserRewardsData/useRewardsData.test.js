// useRewardsData.test.js
import { renderHook, act, waitFor } from "@testing-library/react";
import useRewardsData from "./useRewardsData";

// ✅ Import dependencies BEFORE jest.mock to fix ESLint "import/first"
import { fetchTransactions } from "../../services/api/api";
import { processTransactionsData } from "../../utils/processData/processData";
import Logger from "../../services/logger/logger";

// 🔹 Mock external dependencies
jest.mock("../../services/api/api", () => ({
  fetchTransactions: jest.fn(),
}));

jest.mock("../../utils/processData/processData", () => ({
  processTransactionsData: jest.fn(),
}));

jest.mock("../../services/logger/logger", () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe("useRewardsData hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 test("loads and processes data successfully", async () => {
  const fakeData = [{ id: "1", customerName: "Alice", date: "2023-07-01" }];
  const processed = {
    transactions: fakeData,
    monthlyRewards: [
      { customerId: 1, customerName: "Alice", month: 7, year: 2023, rewardPoints: 50 },
    ],
    totalRewards: [
      { customerId: 1, customerName: "Alice", rewardPoints: 50 },
    ],
  };

  // ✅ Mock API + processor
  fetchTransactions.mockResolvedValue({ success: true, data: fakeData });
  processTransactionsData.mockReturnValue(processed);

  const { result } = renderHook(() => useRewardsData());

  // ✅ Wait until hook finishes
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  // ✅ Assertions
  expect(result.current.error === null || result.current.error === undefined).toBe(true);
  expect(result.current.filteredTransactions).toEqual(fakeData);
  expect(result.current.filteredMonthlyRewards).toEqual(processed.monthlyRewards);

  // ✅ Safer check for rewards
  expect(result.current.filteredTotalRewards).toHaveLength(1);
  expect(result.current.filteredTotalRewards[0].rewardPoints).toBe(50);

  // ✅ Logger expectations (cover what your hook actually calls)
  expect(Logger.info).toHaveBeenCalledWith("Loading rewards data");
  // Only assert debug if your hook actually calls it
  // expect(Logger.debug).toHaveBeenCalled();
});


  test("handles fetch failure", async () => {
    fetchTransactions.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useRewardsData());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Failed to fetch data");
    expect(Logger.error).toHaveBeenCalled();
  });

  test("handles fetch error (exception)", async () => {
    fetchTransactions.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useRewardsData());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(Logger.error).toHaveBeenCalled();
  });

  test("applies name filter", async () => {
    const fakeData = [{ id: "1", customerName: "Alice", date: "2023-07-01" }];
    const processed = { transactions: fakeData, monthlyRewards: [], totalRewards: [] };

    fetchTransactions.mockResolvedValue({ success: true, data: fakeData });
    processTransactionsData.mockReturnValue(processed);

    const { result } = renderHook(() => useRewardsData());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setNameFilter("bob");
    });

    expect(result.current.filteredTransactions).toHaveLength(0); // Alice doesn’t match "bob"
  });

  test("applies date filter", async () => {
    const fakeData = [{ id: "1", customerName: "Alice", date: "2023-07-01" }];
    const processed = {
      transactions: fakeData,
      monthlyRewards: [
        { customerId: 1, customerName: "Alice", month: 7, year: 2023, rewardPoints: 50 },
      ],
      totalRewards: [],
    };

    fetchTransactions.mockResolvedValue({ success: true, data: fakeData });
    processTransactionsData.mockReturnValue(processed);

    const { result } = renderHook(() => useRewardsData());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setFromDate("2023-08-01"); // ✅ use full YYYY-MM-DD
    });

    expect(result.current.filteredTransactions).toHaveLength(0);
    expect(result.current.filteredMonthlyRewards).toHaveLength(0);
  });
});
