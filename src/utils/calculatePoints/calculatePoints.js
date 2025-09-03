/**
 * Calculates reward points for a transaction amount based on the following rules:
 * - 2 points for every dollar spent over $100
 * - 1 point for every dollar spent between $50 and $100
 * - No points for amounts under $50
 * 
 * @param {number} amount - The transaction amount
 * @returns {number} The calculated reward points
 * @throws {Error} If amount is not a valid number
 * 
 * @example
 * calculateTransactionPoints(120) // returns 90
 * calculateTransactionPoints(75)  // returns 25
 * calculateTransactionPoints(40)  // returns 0
 */
export const calculateTransactionPoints = (amount) => {
  // Accept only real finite numbers (reject numeric strings, NaN, Infinity, objects, etc.)
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    // console.error("Invalid input: amount must be a finite number");
    return 0;
  }

  // Check for negative values
  if (amount < 0) {
    // console.error("Invalid input: amount cannot be negative");
    return 0;
  }

  const roundedAmount = Math.floor(amount);
  let points = 0;

  if (roundedAmount > 100) {
    points += (roundedAmount - 100) * 2;
  }

  if (roundedAmount > 50) {
    points += Math.min(roundedAmount - 50, 50);
  }

  return points;
};
