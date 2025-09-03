/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique transaction ID
 * @property {string} customerId - Customer identifier
 * @property {string} customerName - Customer's name
 * @property {string} date - Transaction date in YYYY-MM-DD format
 * @property {number} amount - Transaction amount
 */

/**
 * @typedef {Object} ProcessedData
 * @property {Array<Transaction>} transactions - Transactions with calculated points
 * @property {Array<Object>} monthlyRewards - Monthly rewards by customer
 * @property {Array<Object>} totalRewards - Total rewards by customer
 */

/**
 * Processes transaction data to calculate rewards points and aggregate results
 * @param {Array<Transaction>} transactions - Array of transaction objects
 * @returns {ProcessedData} Processed transaction data with rewards calculations
 */
import { calculateTransactionPoints } from '../calculatePoints/calculatePoints';

export const processTransactionsData = (transactions) => {
  // Add points to each transaction
  const transactionsWithPoints = transactions.map(transaction => ({
    ...transaction,
    points: calculateTransactionPoints(transaction.amount)
  }));

  // Aggregate monthly rewards
  const monthlyRewards = transactionsWithPoints.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${transaction.customerId}-${month}-${year}`;
    
    if (!acc[key]) {
      acc[key] = {
        customerId: transaction.customerId,
        customerName: transaction.customerName,
        month,
        year,
        rewardPoints: 0
      };
    }
    
    acc[key].rewardPoints += transaction.points;
    return acc;
  }, {});

  // Aggregate total rewards
  const totalRewards = transactionsWithPoints.reduce((acc, transaction) => {
    if (!acc[transaction.customerId]) {
      acc[transaction.customerId] = {
        customerId: transaction.customerId,
        customerName: transaction.customerName,
        rewardPoints: 0
      };
    }
    
    acc[transaction.customerId].rewardPoints += transaction.points;
    return acc;
  }, {});

  return {
    transactions: transactionsWithPoints,
    monthlyRewards: Object.values(monthlyRewards),
    totalRewards: Object.values(totalRewards)
  };
};

/**
 * Sorts transactions by date in descending order
 * @param {Array<Transaction>} transactions - Array of transaction objects
 * @returns {Array<Transaction>} New sorted array of transactions
 */
export const sortByDate = (transactions) => {
  return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Sorts monthly rewards by year and month in descending order
 * @param {Array<Object>} monthlyRewards - Array of monthly reward objects
 * @returns {Array<Object>} New sorted array of monthly rewards
 */
export const sortMonthlyRewards = (monthlyRewards) => {
  return [...monthlyRewards].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};

export const sortTransactions = (transactions, sortOrder) => {
  const sorted = [...transactions];
  
  switch (sortOrder) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'amount-desc':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':
      return sorted.sort((a, b) => a.amount - b.amount);
    case 'points-desc':
      return sorted.sort((a, b) => b.points - a.points);
    case 'points-asc':
      return sorted.sort((a, b) => a.points - b.points);
    default:
      return sorted;
  }
};