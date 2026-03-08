import { NextRequest, NextResponse } from 'next/server';
import { createTask, getTasks, updateTask } from '@/lib/tasks/store';
import { TaskCreateInput, TaskUpdateInput } from '@/lib/tasks/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeArchived = searchParams.get('archived') === '1';
  const tasks = await getTasks({ includeArchived });
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as TaskCreateInput;
  const tasks = await createTask(body);
  return NextResponse.json({ tasks });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as TaskUpdateInput;
  const tasks = await updateTask(body);
  return NextResponse.json({ tasks });
}
