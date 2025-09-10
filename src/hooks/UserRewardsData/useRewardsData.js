import { useState, useEffect } from "react";
import { fetchTransactions } from "../../services/api/api";
import { processTransactionsData } from "../../utils/processData/processData";
import Logger from "../../services/logger/logger";

/**
 * Custom hook for managing rewards program data and filters
 */
const useRewardsData = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [fromDate, setFromDate] = useState("");   // ✅ empty means no lower bound
  const [toDate, setToDate] = useState("");       // ✅ empty means no upper bound
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
   * Filters data by date range (only if fromDate/toDate are set)
   */
  const filterDataByDateRange = (data, isMonthly = false) => {
    return data.filter((item) => {
      const itemDate = isMonthly
        ? `${item.year}-${String(item.month).padStart(2, "0")}`
        : item.date.substring(0, 7);

      // ✅ If no fromDate or toDate set, don't filter
      const afterFrom = !fromDate || itemDate >= fromDate;
      const beforeTo = !toDate || itemDate <= toDate;

      return afterFrom && beforeTo;
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
  const filteredTransactions = filterByName(
    filterDataByDateRange(transactions)
  );
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