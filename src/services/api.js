// src/api.js

export const fetchTransactions = async () => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = await fetch("../db.json"); // from public folder
    if (!response.ok) {
      throw new Error("Failed to fetch transactions data");
    }

    const transactions = await response.json();
    return {
      success: true,
      data: transactions,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to fetch transactions data');
  }
};
