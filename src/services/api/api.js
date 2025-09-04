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
  baseURL: process.env.PUBLIC_URL || '',
  mockDataPath: '/db.json'
};

/**
 * Fetches transaction data from the JSON file
 * @async
 * @returns {Promise<{success: boolean, data: Array<Object>, error?: string}>}
 */
export const fetchTransactions = async () => {
  try {
    Logger.info('Fetching transactions data');
    
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.mockDataPath}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    
    // Extract transactions array from the JSON structure
    const transactions = jsonData.transactions || [];
    
    Logger.debug('Transactions data received', { count: transactions.length });

    return {
      success: true,
      data: transactions
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

/**
 * Fetches customer data from the JSON file
 * @async
 * @returns {Promise<{success: boolean, data: Array<Object>, error?: string}>}
 */
export const fetchCustomers = async () => {
  try {
    Logger.info('Fetching customers data');
    
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.mockDataPath}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    
    // Extract customers array from the JSON structure
    const customers = jsonData.customers || [];
    
    Logger.debug('Customers data received', { count: customers.length });

    return {
      success: true,
      data: customers
    };

  } catch (error) {
    Logger.error('Failed to fetch customers', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch customers',
      data: []
    };
  }
};

/**
 * Fetches all data from the JSON file
 * @async
 * @returns {Promise<{success: boolean, data: Object, error?: string}>}
 */
export const fetchAllData = async () => {
  try {
    Logger.info('Fetching all data');
    
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.mockDataPath}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    Logger.debug('All data received', {
      transactions: data.transactions?.length || 0,
      customers: data.customers?.length || 0
    });

    return {
      success: true,
      data
    };

  } catch (error) {
    Logger.error('Failed to fetch all data', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch all data',
      data: {}
    };
  }
};

/**
 * Fetches data with optional filtering
 * @async
 * @param {string} entity - The entity to fetch ('transactions', 'customers')
 * @param {Object} filters - Optional filter criteria
 * @returns {Promise<{success: boolean, data: Array<Object>, error?: string}>}
 */
export const fetchDataWithFilters = async (entity, filters = {}) => {
  try {
    Logger.info(`Fetching ${entity} data with filters`, { filters });
    
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.mockDataPath}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    let data = jsonData[entity] || [];
    
    // Apply filters if provided
    if (Object.keys(filters).length > 0) {
      data = data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          return item[key] === value;
        });
      });
    }
    
    Logger.debug(`Filtered ${entity} data received`, { 
      count: data.length,
      filters 
    });

    return {
      success: true,
      data
    };

  } catch (error) {
    Logger.error(`Failed to fetch ${entity}`, error);
    return {
      success: false,
      error: error.message || `Failed to fetch ${entity}`,
      data: []
    };
  }
};