import { getDatabase } from './database';

export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  created_at?: string;
}

export async function insertTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO transactions (type, amount, category, description, date) VALUES (?, ?, ?, ?, ?)`,
    [transaction.type, transaction.amount, transaction.category, transaction.description ?? '', transaction.date],
  );
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDatabase();
  return db.getAllAsync<Transaction>(`SELECT * FROM transactions ORDER BY date DESC, created_at DESC`);
}

export async function getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
  const db = await getDatabase();
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  return db.getAllAsync<Transaction>(
    `SELECT * FROM transactions WHERE date LIKE ? ORDER BY date DESC`,
    [`${monthStr}%`],
  );
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
}
