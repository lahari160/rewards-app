import React from 'react';
import PropTypes from 'prop-types';

const TotalRewardsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No total rewards data available</p>;
  }

  return (
    <div className="table-container">
      <table className="rewards-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Total Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((reward) => (
            <tr key={reward.customerId}>
              <td>{reward.customerId}</td>
              <td>{reward.customerName}</td>
              <td>{reward.rewardPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TotalRewardsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      customerName: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TotalRewardsTable;