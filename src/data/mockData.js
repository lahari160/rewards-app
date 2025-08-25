export const generateMockTransactions = () => {
  const customers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];

  const products = ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Charger', 'Monitor', 'Keyboard'];

  const transactions = [];
  
  // Generate transactions for last 3 months
  for (let i = 0; i < 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const monthOffset = Math.floor(Math.random() * 3); // 0, 1, or 2 months ago
    
    const transactionDate = new Date();
    transactionDate.setMonth(transactionDate.getMonth() - monthOffset);
    transactionDate.setDate(Math.floor(Math.random() * 28) + 1); // Random day
    
    const amount = parseFloat((Math.random() * 200 + 10).toFixed(2)); // $10-$210
    
    transactions.push({
      id: `trans-${1000 + i}`,
      customerId: customer.id,
      customerName: customer.name,
      date: transactionDate.toISOString(),
      product: products[Math.floor(Math.random() * products.length)],
      amount: amount
    });
  }

  return transactions;
};