/**
 * API service module for handling data fetching operations
 * @module services/api
 */
import Logger from '../logger/logger';

/**
 * API configuration
 * @constant {Object}
 */
const API_CONFIG = {
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  }
};

/**
 * Fetches transaction data from the API
 * @async
 * @returns {Promise<{success: boolean, data: Array<Object>, error?: string}>}
 */
export const fetchTransactions = async () => {
  try {
    Logger.info('Fetching transactions data');
    
    const response = await fetch(`${API_CONFIG.baseURL}/transactions`, {
      method: 'GET',
      headers: API_CONFIG.headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    Logger.debug('Transactions data received', { count: data.length });

    return {
      success: true,
      data
    };

  } catch (error) {
    Logger.error('Failed to fetch transactions', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch transactions',
      data: []
    };
  }
};
