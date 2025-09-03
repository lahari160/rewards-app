import React from 'react';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';
import TransactionsTable from '../../rewards/tables/TransactionsTable/TransactionsTable';
import MonthlyRewardsTable from '../../rewards/tables/MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from '../../rewards/tables/TotalRewardsTable/TotalRewardsTable';
import DateRangeFilter from '../filters/DataRangeFilter/DateRangeFilter';
import FilterBar from '../filters/FilterBar/FilterBar';
import ErrorBoundary from '../../common/ErrorBoundary/ErrorBoundary';
import useRewardsData from '../../../hooks/UserRewardsData/useRewardsData';

/**
 * Main component for the rewards program that displays transactions and rewards
 * @component
 * @returns {JSX.Element} RewardsProgram component
 */
const RewardsProgram = () => {
  const {
    filteredTransactions,
    filteredMonthlyRewards,
    filteredTotalRewards,
    fromDate,
    toDate,
    nameFilter,
    isLoading,
    error,
    setFromDate,
    setToDate,
    setNameFilter,
    loadData
  } = useRewardsData();

  if (isLoading) {
    return <LoadingSpinner message="Loading transactions data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="rewards-program">
      <header className="app-header">
        <h1>Customer Rewards Program</h1>
      </header>

      <div className="header-controls">
        <FilterBar
          filterValue={nameFilter}
          onFilterChange={setNameFilter}
          placeholder="Filter by customer name..."
        />
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
        <button onClick={loadData} className="refresh-btn">
          Refresh Data
        </button>
      </div>

      <main className="app-main">
        <ErrorBoundary>
          <section className="section">
            <h2>Monthly Rewards</h2>
            <MonthlyRewardsTable data={filteredMonthlyRewards} />
          </section>
        </ErrorBoundary>

        <ErrorBoundary>
          <section className="section">
            <h2>Total Rewards</h2>
            <TotalRewardsTable data={filteredTotalRewards} />
          </section>
        </ErrorBoundary>

        <ErrorBoundary>
          <section className="section">
            <h2>Transactions</h2>
            <TransactionsTable data={filteredTransactions} />
          </section>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default RewardsProgram;