import React, { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import TransactionsTable from './components/TransactionsTable';
import MonthlyRewardsTable from './components/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewardsTable';
import { fetchTransactions } from './services/api';
import { processTransactionsData, sortByDate, sortMonthlyRewards } from './utils/processData';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [totalRewards, setTotalRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchTransactions();
      
      if (response.success) {
        const processedData = processTransactionsData(response.data);
        
        setTransactions(sortByDate(processedData.transactions));
        setMonthlyRewards(sortMonthlyRewards(processedData.monthlyRewards));
        setTotalRewards(processedData.totalRewards);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading transactions data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Customer Rewards Program</h1>
        <button onClick={loadData} className="refresh-btn">
          Refresh Data
        </button>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>Monthly Rewards</h2>
          <MonthlyRewardsTable data={monthlyRewards} />
        </section>

        <section className="section">
          <h2>Total Rewards</h2>
          <TotalRewardsTable data={totalRewards} />
        </section>

        <section className="section">
          <h2>Transactions</h2>
          <TransactionsTable data={transactions} />
        </section>
      </main>
    </div>
  );
}

export default App;