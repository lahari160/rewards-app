import { 
  processTransactionsData,
  sortByDate,
  sortMonthlyRewards,
  sortTransactions
} from "./processData";
import { calculateTransactionPoints } from "../calculatePoints/calculatePoints";

jest.mock("../calculatePoints/calculatePoints");

describe("processData utils", () => {
  const sampleTransactions = [
    { id: "1", customerId: "C1", customerName: "Alice", date: "2023-01-15", amount: 120 },
    { id: "2", customerId: "C1", customerName: "Alice", date: "2023-02-10", amount: 80 },
    { id: "3", customerId: "C2", customerName: "Bob",   date: "2023-02-20", amount: 200 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Stub points: amount → amount / 10
    calculateTransactionPoints.mockImplementation(amount => Math.floor(amount / 10));
  });

  test("processTransactionsData adds points and aggregates rewards", () => {
    const result = processTransactionsData(sampleTransactions);

    // Each transaction has points
    expect(result.transactions[0]).toHaveProperty("points");

    // Monthly rewards grouped
    expect(result.monthlyRewards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ customerId: "C1", month: 1, year: 2023 }),
        expect.objectContaining({ customerId: "C1", month: 2, year: 2023 }),
        expect.objectContaining({ customerId: "C2", month: 2, year: 2023 }),
      ])
    );

    // Total rewards grouped by customer
    const aliceTotal = result.totalRewards.find(r => r.customerId === "C1");
    const bobTotal = result.totalRewards.find(r => r.customerId === "C2");

    expect(aliceTotal.rewardPoints).toBeGreaterThan(0);
    expect(bobTotal.rewardPoints).toBeGreaterThan(0);
  });

  test("sortByDate sorts transactions by date descending", () => {
    const sorted = sortByDate(sampleTransactions);
    expect(sorted[0].date).toBe("2023-02-20"); // Bob
    expect(sorted[2].date).toBe("2023-01-15"); // Alice Jan
  });

  test("sortMonthlyRewards sorts by year then month descending", () => {
    const rewards = [
      { customerId: "C1", customerName: "Alice", month: 1, year: 2023 },
      { customerId: "C2", customerName: "Bob",   month: 2, year: 2022 },
      { customerId: "C3", customerName: "Eve",   month: 5, year: 2023 },
    ];
    const sorted = sortMonthlyRewards(rewards);
    expect(sorted[0].month).toBe(5); // May 2023 first
    expect(sorted[sorted.length - 1].year).toBe(2022); // 2022 last
  });

  describe("sortTransactions covers all branches", () => {
    const transactionsWithPoints = [
      { id: "1", date: "2023-01-15", amount: 100, points: 10 },
      { id: "2", date: "2023-01-20", amount: 50, points: 5 },
    ];

    test("date-desc", () => {
      const result = sortTransactions(transactionsWithPoints, "date-desc");
      expect(result[0].date).toBe("2023-01-20");
    });

    test("date-asc", () => {
      const result = sortTransactions(transactionsWithPoints, "date-asc");
      expect(result[0].date).toBe("2023-01-15");
    });

    test("amount-desc", () => {
      const result = sortTransactions(transactionsWithPoints, "amount-desc");
      expect(result[0].amount).toBe(100);
    });

    test("amount-asc", () => {
      const result = sortTransactions(transactionsWithPoints, "amount-asc");
      expect(result[0].amount).toBe(50);
    });

    test("points-desc", () => {
      const result = sortTransactions(transactionsWithPoints, "points-desc");
      expect(result[0].points).toBe(10);
    });

    test("points-asc", () => {
      const result = sortTransactions(transactionsWithPoints, "points-asc");
      expect(result[0].points).toBe(5);
    });

    test("default returns unchanged", () => {
      const result = sortTransactions(transactionsWithPoints, "invalid-key");
      expect(result).toEqual(transactionsWithPoints);
    });
  });
});