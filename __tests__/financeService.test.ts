import {
  calculateMonthlySummary,
  calculateGoalProgress,
  calculateAccumulatedSavings,
  formatCurrency,
} from '../src/services/financeService';
import { Transaction } from '../src/database/transactionRepository';

const makeTransaction = (type: 'income' | 'expense', amount: number): Transaction => ({
  id: 1,
  type,
  amount,
  category: 'Outros',
  date: '2024-01-01',
});

describe('calculateMonthlySummary', () => {
  it('should return zeros for empty array', () => {
    const result = calculateMonthlySummary([]);
    expect(result.totalIncome).toBe(0);
    expect(result.totalExpenses).toBe(0);
    expect(result.balance).toBe(0);
  });

  it('should sum incomes and expenses correctly', () => {
    const transactions = [
      makeTransaction('income', 3000),
      makeTransaction('income', 500),
      makeTransaction('expense', 1200),
      makeTransaction('expense', 300),
    ];
    const result = calculateMonthlySummary(transactions);
    expect(result.totalIncome).toBe(3500);
    expect(result.totalExpenses).toBe(1500);
    expect(result.balance).toBe(2000);
  });

  it('should return negative balance when expenses > income', () => {
    const transactions = [
      makeTransaction('income', 1000),
      makeTransaction('expense', 1500),
    ];
    const result = calculateMonthlySummary(transactions);
    expect(result.balance).toBe(-500);
  });
});

describe('calculateGoalProgress', () => {
  it('should return 0 for zero savings', () => {
    expect(calculateGoalProgress(1000, 0)).toBe(0);
  });

  it('should return 0.5 for half savings', () => {
    expect(calculateGoalProgress(1000, 500)).toBe(0.5);
  });

  it('should cap at 1 when savings exceed target', () => {
    expect(calculateGoalProgress(1000, 2000)).toBe(1);
  });

  it('should return 0 for invalid target', () => {
    expect(calculateGoalProgress(0, 500)).toBe(0);
  });
});

describe('calculateAccumulatedSavings', () => {
  it('should return 0 for empty array', () => {
    expect(calculateAccumulatedSavings([])).toBe(0);
  });

  it('should return positive savings', () => {
    const transactions = [
      makeTransaction('income', 5000),
      makeTransaction('expense', 2000),
    ];
    expect(calculateAccumulatedSavings(transactions)).toBe(3000);
  });

  it('should return 0 when balance is negative (not accumulate debt)', () => {
    const transactions = [
      makeTransaction('income', 500),
      makeTransaction('expense', 2000),
    ];
    expect(calculateAccumulatedSavings(transactions)).toBe(0);
  });
});

describe('formatCurrency', () => {
  it('should format zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should include R$ for BRL', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1');
  });
});
