import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { TaskCreateInput, TaskItem, TaskPriority, TaskStatus, TaskUpdateInput } from '@/lib/tasks/types';

const TASKS_PATH = path.join('/home/jarvis/.openclaw/workspace/mission-control', 'data', 'tasks.json');

function normalizePriority(priority?: string): TaskPriority {
  if (priority === 'high' || priority === 'low') return priority;
  return 'medium';
}

function normalizeStatus(status?: string): TaskStatus {
  if (status === 'in_progress' || status === 'blocked' || status === 'done') return status;
  return 'backlog';
}

function normalizeTask(task: Partial<TaskItem> & { id?: string; title?: string }): TaskItem {
  const timestamp = task.updatedAt || task.createdAt || new Date().toISOString();
  return {
    id: task.id || randomUUID(),
    title: task.title || 'Tâche sans titre',
    description: task.description,
    status: normalizeStatus(task.status),
    priority: normalizePriority(task.priority),
    owner: task.owner || 'Elon',
    category: task.category || 'manuel',
    notes: task.notes,
    links: Array.isArray(task.links) ? task.links : [],
    relatedMemoryIds: Array.isArray(task.relatedMemoryIds) ? task.relatedMemoryIds : [],
    relatedCronIds: Array.isArray(task.relatedCronIds) ? task.relatedCronIds : [],
    archived: Boolean(task.archived),
    createdAt: task.createdAt || timestamp,
    updatedAt: task.updatedAt || timestamp,
    dueAt: task.dueAt || undefined,
  };
}

export async function getTasks(options?: { includeArchived?: boolean }): Promise<TaskItem[]> {
  const raw = await fs.readFile(TASKS_PATH, 'utf8');
  const tasks = (JSON.parse(raw) as Array<Partial<TaskItem>>).map(normalizeTask);
  const filtered = options?.includeArchived ? tasks : tasks.filter((task) => !task.archived);
  return filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveTasks(tasks: TaskItem[]) {
  await fs.writeFile(TASKS_PATH, JSON.stringify(tasks, null, 2) + '\n', 'utf8');
}

export async function createTask(input: TaskCreateInput): Promise<TaskItem[]> {
  const tasks = await getTasks({ includeArchived: true });
  const now = new Date().toISOString();

  const task = normalizeTask({
    title: input.title,
    description: input.description,
    status: 'backlog',
    priority: input.priority,
    owner: input.owner,
    category: input.category || 'manuel',
    notes: input.notes,
    relatedMemoryIds: input.relatedMemoryIds || [],
    relatedCronIds: input.relatedCronIds || [],
    archived: false,
    createdAt: now,
    updatedAt: now,
    dueAt: input.dueAt,
  });

  const next = [task, ...tasks];
  await saveTasks(next);
  return next.filter((item) => !item.archived);
}

export async function updateTask(input: TaskUpdateInput): Promise<TaskItem[]> {
  const tasks = await getTasks({ includeArchived: true });
  const next = tasks.map((task) => {
    if (task.id !== input.taskId) return task;
    return normalizeTask({
      ...task,
      title: input.title ?? task.title,
      description: input.description ?? task.description,
      owner: input.owner ?? task.owner,
      priority: input.priority ?? task.priority,
      category: input.category ?? task.category,
      notes: input.notes ?? task.notes,
      status: input.status ?? task.status,
      archived: input.archived ?? task.archived,
      relatedMemoryIds: input.relatedMemoryIds ?? task.relatedMemoryIds,
      relatedCronIds: input.relatedCronIds ?? task.relatedCronIds,
      dueAt: input.dueAt === null ? undefined : input.dueAt ?? task.dueAt,
      createdAt: task.createdAt,
      updatedAt: new Date().toISOString(),
    });
  });

  await saveTasks(next);
  return next.filter((item) => !item.archived);
}
