'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/layout/card';
import { TaskBoard } from '@/components/tasks/task-board';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskTable } from '@/components/tasks/task-table';
import { TaskItem, TaskPriority, TaskStatus } from '@/lib/tasks/types';

type LinkableItem = { id: string; label: string; meta: string; href?: string };

type FilterState = { query: string; owner: string; status: string; priority: string; category: string };

export function TaskHub({
  initialTasks,
  memoryOptions,
  cronOptions,
  initialFilters,
  focusTaskId,
}: {
  initialTasks: TaskItem[];
  memoryOptions: LinkableItem[];
  cronOptions: LinkableItem[];
  initialFilters?: FilterState;
  focusTaskId?: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('Elon');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('manuel');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [view, setView] = useState<'table' | 'board'>('table');
  const [filters, setFilters] = useState<FilterState>(initialFilters || { query: '', owner: '', status: '', priority: '', category: '' });

  const categories = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.category))).sort((a, b) => a.localeCompare(b)),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = filters.query.trim().toLowerCase();
      const queryOk = query
        ? [task.title, task.description || '', task.notes || '', task.category, task.owner].join(' ').toLowerCase().includes(query)
        : true;
      const ownerOk = filters.owner ? task.owner === filters.owner : true;
      const statusOk = filters.status ? task.status === filters.status : true;
      const priorityOk = filters.priority ? task.priority === filters.priority : true;
      const categoryOk = filters.category ? task.category === filters.category : true;
      return queryOk && ownerOk && statusOk && priorityOk && categoryOk;
    });
  }, [filters, tasks]);

  async function createTask() {
    if (!title.trim()) return;
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, owner, priority, category, description, notes }),
    });
    const data = await response.json();
    setTasks(data.tasks);
    setTitle('');
    setDescription('');
    setNotes('');
  }

  async function updateStatus(taskId: string, status: TaskStatus) {
    const response = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status }),
    });
    const data = await response.json();
    setTasks(data.tasks);
  }

  return (
    <div className="grid">
      <Card>
        <h3>Créer une tâche</h3>
        <div className="task-editor-grid" style={{ marginBottom: 12 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" style={inputStyle} />
          <select value={owner} onChange={(e) => setOwner(e.target.value)} style={inputStyle}>
            <option>Denis</option>
            <option>Elon</option>
            <option>Jocko</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} style={inputStyle}>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Catégorie" style={inputStyle} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" style={textareaStyle} />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" style={textareaStyle} />
        </div>
        <button onClick={createTask} style={buttonStyle}>Ajouter la tâche</button>
      </Card>

      <Card>
        <div className="toolbar-card">
          <TaskFilters filters={filters} categories={categories} onChange={setFilters} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setView('table')} style={view === 'table' ? activeButtonStyle : ghostButtonStyle}>Vue table</button>
            <button onClick={() => setView('board')} style={view === 'board' ? activeButtonStyle : ghostButtonStyle}>Vue board</button>
          </div>
        </div>
      </Card>

      {view === 'table' ? (
        <TaskTable tasks={filteredTasks} memoryOptions={memoryOptions} cronOptions={cronOptions} onTasksChange={setTasks} focusTaskId={focusTaskId} />
      ) : (
        <TaskBoard tasks={filteredTasks} onStatusChange={updateStatus} />
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '10px 12px',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 96,
  resize: 'vertical',
  gridColumn: '1 / -1',
};

const buttonStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
  color: 'white',
  borderRadius: 12,
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  padding: '8px 12px',
};

const ghostButtonStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  borderRadius: 12,
  padding: '8px 12px',
  cursor: 'pointer',
};
