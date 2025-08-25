import { calculateTransactionPoints } from '../calculatePoints';

describe('calculateTransactionPoints', () => {
  test('returns 0 for amounts less than 50', () => {
    expect(calculateTransactionPoints(49.99)).toBe(0);
    expect(calculateTransactionPoints(30)).toBe(0);
  });

  test('returns correct points for amounts between 50 and 100', () => {
    expect(calculateTransactionPoints(50)).toBe(0);
    expect(calculateTransactionPoints(75)).toBe(25);
    expect(calculateTransactionPoints(100)).toBe(50);
  });

  test('returns correct points for amounts over 100', () => {
    expect(calculateTransactionPoints(101)).toBe(52);
    expect(calculateTransactionPoints(120)).toBe(90);
    expect(calculateTransactionPoints(200)).toBe(250);
  });

  test('handles decimal amounts correctly', () => {
    expect(calculateTransactionPoints(100.2)).toBe(50);
    expect(calculateTransactionPoints(100.9)).toBe(50);
    expect(calculateTransactionPoints(150.5)).toBe(150);
  });

  test('returns 0 for negative amounts', () => {
    expect(calculateTransactionPoints(-50)).toBe(0);
  });
});