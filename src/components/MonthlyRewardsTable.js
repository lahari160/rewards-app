import React from 'react';
import PropTypes from 'prop-types';

const MonthlyRewardsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No monthly rewards data available</p>;
  }

  const formatMonthYear = (month, year) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="table-container">
      <table className="rewards-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Period</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((reward) => (
            <tr key={`${reward.customerId}-${reward.month}-${reward.year}`}>
              <td>{reward.customerId}</td>
              <td>{reward.customerName}</td>
              <td>{formatMonthYear(reward.month, reward.year)}</td>
              <td>{reward.rewardPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

MonthlyRewardsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      customerName: PropTypes.string.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired
    })
  ).isRequired
};

export default MonthlyRewardsTable;