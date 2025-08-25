import React from 'react';
import PropTypes from 'prop-types';

const TransactionsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No transactions available</p>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="table-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer Name</th>
            <th>Purchase Date</th>
            <th>Product</th>
            <th>Price</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.customerName}</td>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.product}</td>
              <td>{formatCurrency(transaction.amount)}</td>
              <td>{transaction.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      product: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      points: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TransactionsTable;