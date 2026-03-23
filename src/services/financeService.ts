import { Transaction } from '../database/transactionRepository';

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function calculateMonthlySummary(transactions: Transaction[]): MonthlySummary {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
    }
  }

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

export function calculateGoalProgress(
  targetAmount: number,
  accumulatedSavings: number,
): number {
  if (targetAmount <= 0) return 0;
  const progress = accumulatedSavings / targetAmount;
  return Math.min(Math.max(progress, 0), 1);
}

export function calculateAccumulatedSavings(allTransactions: Transaction[]): number {
  let total = 0;
  for (const t of allTransactions) {
    if (t.type === 'income') {
      total += t.amount;
    } else {
      total -= t.amount;
    }
  }
  return Math.max(total, 0);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimento', 'Presente', 'Outros'],
  expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Roupas', 'Outros'],
};
