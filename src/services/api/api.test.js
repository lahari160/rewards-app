// src/services/api/api.test.js
import { fetchTransactions, fetchCustomers, fetchAllData, fetchDataWithFilters } from "./api";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("fetchTransactions returns transactions on success", async () => {
  const mockResponse = { transactions: [{ id: 1, customerName: "Alice" }] };
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  const result = await fetchTransactions();
  expect(result.success).toBe(true);
  expect(result.data).toEqual(mockResponse.transactions);
});

test("fetchCustomers returns customers on success", async () => {
  const mockResponse = { customers: [{ id: 10, name: "Bob" }] };
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  const result = await fetchCustomers();
  expect(result.success).toBe(true);
  expect(result.data).toEqual(mockResponse.customers);
});

test("fetchAllData returns both customers and transactions", async () => {
  const mockResponse = {
    transactions: [{ id: 1 }],
    customers: [{ id: 2 }],
  };
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  const result = await fetchAllData();
  expect(result.success).toBe(true);
  expect(result.data).toEqual(mockResponse);
});

test("fetchDataWithFilters applies filters correctly", async () => {
  const mockResponse = {
    transactions: [
      { id: 1, type: "food" },
      { id: 2, type: "clothes" },
    ],
  };
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  const result = await fetchDataWithFilters("transactions", { type: "food" });
  expect(result.success).toBe(true);
  expect(result.data).toEqual([{ id: 1, type: "food" }]);
});

test("handles fetch error gracefully", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 500,
  });

  const result = await fetchTransactions();
  expect(result.success).toBe(false);
  expect(result.error).toMatch(/HTTP error/);
});
