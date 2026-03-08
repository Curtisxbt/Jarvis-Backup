import fs from 'node:fs/promises';
import path from 'node:path';
import { TaskItem } from '@/lib/tasks/types';

const TASKS_PATH = path.join('/home/jarvis/.openclaw/workspace/mission-control', 'data', 'tasks.json');

export async function getTasks(): Promise<TaskItem[]> {
  const raw = await fs.readFile(TASKS_PATH, 'utf8');
  const tasks = JSON.parse(raw) as TaskItem[];
  return tasks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveTasks(tasks: TaskItem[]) {
  await fs.writeFile(TASKS_PATH, JSON.stringify(tasks, null, 2) + '\n', 'utf8');
}
