export type TaskStatus = 'backlog' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskLink {
  label: string;
  url: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string;
  category: string;
  notes?: string;
  links?: TaskLink[];
  relatedMemoryIds?: string[];
  relatedCronIds?: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  dueAt?: string;
}

export interface TaskCreateInput {
  title: string;
  owner?: string;
  priority?: TaskPriority;
  category?: string;
  notes?: string;
  description?: string;
  dueAt?: string;
  relatedMemoryIds?: string[];
  relatedCronIds?: string[];
}

export interface TaskUpdateInput {
  taskId: string;
  title?: string;
  owner?: string;
  priority?: TaskPriority;
  category?: string;
  notes?: string;
  description?: string;
  status?: TaskStatus;
  archived?: boolean;
  dueAt?: string | null;
  relatedMemoryIds?: string[];
  relatedCronIds?: string[];
}
