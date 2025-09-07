import { useState, useEffect } from "react";
import { fetchTransactions } from "../../services/api/api";
import { processTransactionsData } from "../../utils/processData/processData";
import Logger from "../../services/logger/logger";

/**
 * @typedef {Object} RewardsData
 * @property {Array<Object>} filteredTransactions - Filtered transaction data
 * @property {Array<Object>} filteredMonthlyRewards - Filtered monthly rewards
 * @property {Array<Object>} filteredTotalRewards - Filtered total rewards
 * @property {string} fromDate - Start date filter (YYYY-MM)
 * @property {string} toDate - End date filter (YYYY-MM)
 * @property {string} nameFilter - Customer name filter
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message if any
 */

/**
 * Custom hook for managing rewards program data and filters
 * @returns {RewardsData & {
 *   setFromDate: (date: string) => void,
 *   setToDate: (date: string) => void,
 *   setNameFilter: (name: string) => void,
 *   loadData: () => Promise<void>
 * }} Rewards data and control functions
 */
const useRewardsData = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  // const [totalRewards, setTotalRewards] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      Logger.info("Loading rewards data");
      setIsLoading(true);
      setError(null);

      const response = await fetchTransactions();

      if (response.success) {
        const processedData = processTransactionsData(response.data);
        Logger.debug("Processed rewards data", {
          transactions: processedData.transactions.length,
          monthlyRewards: processedData.monthlyRewards.length,
          totalRewards: processedData.totalRewards.length,
        });

        setTransactions(processedData.transactions);
        setMonthlyRewards(processedData.monthlyRewards);
        // setTotalRewards(processedData.totalRewards);

        setError(null); // ✅ ensure error is reset on success
      } else {
        Logger.error("Failed to fetch data", { response });
        setError("Failed to fetch data");
      }
    } catch (err) {
      Logger.error("Error loading rewards data", err);
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Filters data by date range
   */
  const filterDataByDateRange = (data, dateField) => {
    return data.filter((item) => {
      const itemDate = dateField
        ? `${item.year}-${String(item.month).padStart(2, "0")}`
        : item.date.substring(0, 7);

      return (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);
    });
  };

  /**
   * Filters data by customer name
   */
  const filterByName = (data) => {
    if (!nameFilter) return data;
    return data.filter((item) =>
      item.customerName.toLowerCase().includes(nameFilter.toLowerCase())
    );
  };

  // Apply filters
  const filteredTransactions = filterByName(filterDataByDateRange(transactions));
  const filteredMonthlyRewards = filterByName(
    filterDataByDateRange(monthlyRewards, true)
  );

  // Aggregate total rewards
  const filteredTotalRewards = filteredMonthlyRewards.reduce((acc, reward) => {
    const key = reward.customerId;
    if (!acc[key]) {
      acc[key] = {
        customerId: reward.customerId,
        customerName: reward.customerName,
        rewardPoints: 0,
      };
    }
    acc[key].rewardPoints += reward.rewardPoints;
    return acc;
  }, {});

  return {
    filteredTransactions,
    filteredMonthlyRewards,
    filteredTotalRewards: Object.values(filteredTotalRewards),
    fromDate,
    toDate,
    nameFilter,
    isLoading,
    error,
    setFromDate,
    setToDate,
    setNameFilter,
    loadData,
  };
};

export default useRewardsData;