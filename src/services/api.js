import { generateMockTransactions } from '../data/mockData';

export const fetchTransactions = async () => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const transactions = generateMockTransactions();
    return {
      success: true,
      data: transactions,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Failed to fetch transactions data');
  }
};