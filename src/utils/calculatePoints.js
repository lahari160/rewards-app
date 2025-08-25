export const calculateTransactionPoints = (amount) => {
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