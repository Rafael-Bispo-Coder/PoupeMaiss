import { getDatabase } from './database';

export interface Goal {
  id?: number;
  title: string;
  target_amount: number;
  deadline: string;
  created_at?: string;
}

export async function insertGoal(goal: Omit<Goal, 'id' | 'created_at'>): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO goals (title, target_amount, deadline) VALUES (?, ?, ?)`,
    [goal.title, goal.target_amount, goal.deadline],
  );
}

export async function getAllGoals(): Promise<Goal[]> {
  const db = await getDatabase();
  return db.getAllAsync<Goal>(`SELECT * FROM goals ORDER BY deadline ASC`);
}

export async function deleteGoal(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM goals WHERE id = ?`, [id]);
}
