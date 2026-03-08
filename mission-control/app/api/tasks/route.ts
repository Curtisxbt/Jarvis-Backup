import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getTasks, saveTasks } from '@/lib/tasks/store';
import { TaskStatus } from '@/lib/tasks/types';

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tasks = await getTasks();

  tasks.unshift({
    id: randomUUID(),
    title: String(body.title || 'Untitled task'),
    status: 'backlog',
    priority: body.priority === 'high' || body.priority === 'low' ? body.priority : 'medium',
    owner: String(body.owner || 'Elon'),
    category: 'manual',
    updatedAt: new Date().toISOString(),
    notes: body.notes ? String(body.notes) : undefined,
  });

  await saveTasks(tasks);
  return NextResponse.json({ tasks });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const tasks = await getTasks();
  const status = body.status as TaskStatus;

  const updated = tasks.map((task) =>
    task.id === body.taskId
      ? { ...task, status, updatedAt: new Date().toISOString() }
      : task,
  );

  await saveTasks(updated);
  return NextResponse.json({ tasks: updated });
}
