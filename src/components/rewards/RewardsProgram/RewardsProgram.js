import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage/ErrorMessage";
import TransactionsTable from "../../rewards/tables/TransactionsTable/TransactionsTable";
import MonthlyRewardsTable from "../../rewards/tables/MonthlyRewardsTable/MonthlyRewardsTable";
import TotalRewardsTable from "../../rewards/tables/TotalRewardsTable/TotalRewardsTable";
import DateRangeFilter from "../filters/DataRangeFilter/DateRangeFilter";
import FilterBar from "../filters/FilterBar/FilterBar";
import ErrorBoundary from "../../common/ErrorBoundary/ErrorBoundary";
import useRewardsData from "../../../hooks/UserRewardsData/useRewardsData";

import {
  Stack,
  Button,
  Container,
  Box,
  Typography,
  Paper,
} from "@mui/material";

/**
 * Get default date range (from = 90 days ago, to = today)
 */
const getDefaultDateRange = () => {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 90);

  return {
    from: priorDate.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  };
};

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
    loadData,
  } = useRewardsData();

  // Ensure defaults on first load
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && (!fromDate || !toDate)) {
      const defaults = getDefaultDateRange();
      setFromDate(defaults.from);
      setToDate(defaults.to);
      setInitialized(true);
    }
  }, [initialized, fromDate, toDate, setFromDate, setToDate]);

  const handleClearDateRange = () => {
    const defaults = getDefaultDateRange();
    setFromDate(defaults.from);
    setToDate(defaults.to);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading transactions data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* App Header */}
      <Box component="header" textAlign="center" mb={4}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, fontWeight: 600 }}
        >
          Customer Rewards Program
        </Typography>
      </Box>

      {/* Header Controls */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
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
            onClear={handleClearDateRange}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth={{ xs: true, sm: false }}
            onClick={loadData}
          >
            Refresh Data
          </Button>
        </Stack>
      </Paper>

      {/* Main Sections */}
      <Box component="main">
        <ErrorBoundary>
          <Section title="Monthly Rewards">
            <MonthlyRewardsTable data={filteredMonthlyRewards} />
          </Section>
        </ErrorBoundary>

        <ErrorBoundary>
          <Section title="Total Rewards">
            <TotalRewardsTable data={filteredTotalRewards} />
          </Section>
        </ErrorBoundary>

        <ErrorBoundary>
          <Section title="Transactions">
            <TransactionsTable data={filteredTransactions} />
          </Section>
        </ErrorBoundary>
      </Box>
    </Container>
  );
};

/**
 * Reusable section wrapper with consistent styling
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @returns {JSX.Element}
 */
const Section = ({ title, children }) => (
  <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
    <Typography
      variant="h6"
      component="h2"
      sx={{
        mb: 2,
        fontSize: { xs: "1.1rem", sm: "1.25rem" },
        fontWeight: 500,
      }}
    >
      {title}
    </Typography>
    {children}
  </Paper>
);

export default RewardsProgram;