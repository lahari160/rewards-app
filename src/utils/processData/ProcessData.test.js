import { processTransactionsData, sortByDate, sortMonthlyRewards } from '../processData/processData';

describe('processTransactionsData', () => {
  const mockTransactions = [
    { id: '1', customerId: '101', customerName: 'John', date: '2023-01-15', amount: 120 },
    { id: '2', customerId: '101', customerName: 'John', date: '2023-02-15', amount: 75 },
    { id: '3', customerId: '102', customerName: 'Jane', date: '2023-01-20', amount: 200 }
  ];

  test('processes transactions and calculates rewards correctly', () => {
    const result = processTransactionsData(mockTransactions);
    
    expect(result).toHaveProperty('transactions');
    expect(result).toHaveProperty('monthlyRewards');
    expect(result).toHaveProperty('totalRewards');
    
    // Check transactions have points
    expect(result.transactions[0].points).toBe(90);
    expect(result.transactions[1].points).toBe(25);
    expect(result.transactions[2].points).toBe(250);
  });

  test('aggregates monthly rewards correctly', () => {
    const result = processTransactionsData(mockTransactions);
    
    const johnJan = result.monthlyRewards.find(r => 
      r.customerId === '101' && r.month === 1);
    expect(johnJan.rewardPoints).toBe(90);
    
    const johnFeb = result.monthlyRewards.find(r => 
      r.customerId === '101' && r.month === 2);
    expect(johnFeb.rewardPoints).toBe(25);
  });

  test('aggregates total rewards correctly', () => {
    const result = processTransactionsData(mockTransactions);
    
    const johnTotal = result.totalRewards.find(r => r.customerId === '101');
    expect(johnTotal.rewardPoints).toBe(115); // 90 + 25
    
    const janeTotal = result.totalRewards.find(r => r.customerId === '102');
    expect(janeTotal.rewardPoints).toBe(250);
  });

  test('handles empty transactions array', () => {
    const result = processTransactionsData([]);
    
    expect(result.transactions).toEqual([]);
    expect(result.monthlyRewards).toEqual([]);
    expect(result.totalRewards).toEqual([]);
  });
});

describe('sortByDate', () => {
  const transactions = [
    { date: '2023-02-15' },
    { date: '2023-01-15' },
    { date: '2023-03-15' }
  ];

  test('sorts transactions by date in descending order', () => {
    const sorted = sortByDate(transactions);
    expect(sorted[0].date).toBe('2023-03-15');
    expect(sorted[2].date).toBe('2023-01-15');
  });

  test('returns new array without modifying original', () => {
    const original = [...transactions];
    sortByDate(transactions);
    expect(transactions).toEqual(original);
  });
});

describe('sortMonthlyRewards', () => {
  const rewards = [
    { month: 2, year: 2023 },
    { month: 1, year: 2023 },
    { month: 12, year: 2022 }
  ];

  test('sorts rewards by year and month', () => {
    const sorted = sortMonthlyRewards(rewards);
    expect(sorted[0].year).toBe(2023);
    expect(sorted[0].month).toBe(2);
  });

  test('returns new array without modifying original', () => {
    const original = [...rewards];
    sortMonthlyRewards(rewards);
    expect(rewards).toEqual(original);
  });
});