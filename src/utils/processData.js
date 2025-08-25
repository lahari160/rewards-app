import { calculateTransactionPoints } from './calculatePoints';

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

// Sort functions
export const sortByDate = (transactions) => {
  return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const sortMonthlyRewards = (monthlyRewards) => {
  return [...monthlyRewards].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};