import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { initDatabase } from '../database/database';
import { Transaction, getAllTransactions, getTransactionsByMonth } from '../database/transactionRepository';
import { Goal, getAllGoals } from '../database/goalRepository';
import { MonthlySummary, calculateMonthlySummary, calculateAccumulatedSavings } from '../services/financeService';

interface AppContextData {
  transactions: Transaction[];
  goals: Goal[];
  monthlySummary: MonthlySummary;
  accumulatedSavings: number;
  currentYear: number;
  currentMonth: number;
  setCurrentMonth: (year: number, month: number) => void;
  refreshData: () => Promise<void>;
  isReady: boolean;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonthState] = useState(now.getMonth() + 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refreshData = useCallback(async () => {
    const [monthly, all, goalList] = await Promise.all([
      getTransactionsByMonth(currentYear, currentMonth),
      getAllTransactions(),
      getAllGoals(),
    ]);
    setTransactions(monthly);
    setAllTransactions(all);
    setGoals(goalList);
  }, [currentYear, currentMonth]);

  useEffect(() => {
    initDatabase()
      .then(refreshData)
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error('Failed to initialize database:', err);
        setIsReady(true);
      });
  }, [refreshData]);

  const setCurrentMonth = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonthState(month);
  };

  const monthlySummary = calculateMonthlySummary(transactions);
  const accumulatedSavings = calculateAccumulatedSavings(allTransactions);

  return (
    <AppContext.Provider
      value={{
        transactions,
        goals,
        monthlySummary,
        accumulatedSavings,
        currentYear,
        currentMonth,
        setCurrentMonth,
        refreshData,
        isReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
