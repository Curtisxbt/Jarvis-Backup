'use client';

import { useMemo, useState } from 'react';
import { TaskItem, TaskStatus } from '@/lib/tasks/types';
import { Card } from '@/components/layout/card';

const columns: Array<{ key: TaskStatus; label: string }> = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'done', label: 'Done' },
];

export function TaskBoard({ initialTasks }: { initialTasks: TaskItem[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('Elon');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const grouped = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.status === column.key),
    }));
  }, [tasks]);

  async function createTask() {
    if (!title.trim()) return;
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, owner, priority }),
    });
    const data = await response.json();
    setTasks(data.tasks);
    setTitle('');
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
        <h3>Create task</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" style={inputStyle} />
          <select value={owner} onChange={(e) => setOwner(e.target.value)} style={inputStyle}>
            <option>Denis</option>
            <option>Elon</option>
            <option>Jocko</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')} style={inputStyle}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={createTask} style={buttonStyle}>Add</button>
        </div>
      </Card>
      <div className="grid cols-2">
        {grouped.map((column) => (
          <Card key={column.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{column.label}</h3>
              <span className="badge">{column.tasks.length}</span>
            </div>
            <div className="grid">
              {column.tasks.map((task) => (
                <div key={task.id} style={taskCardStyle}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span className="badge">{task.owner}</span>
                    <span className="badge">{task.priority}</span>
                    <span className="badge">{task.category}</span>
                  </div>
                  <strong>{task.title}</strong>
                  {task.notes ? <p className="muted">{task.notes}</p> : null}
                  <div className="muted code">Updated {new Date(task.updatedAt).toLocaleString('fr-FR')}</div>
                  <div style={{ marginTop: 10 }}>
                    <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)} style={inputStyle}>
                      {columns.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '10px 12px',
  minWidth: 160,
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

const taskCardStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 14,
  background: 'rgba(255,255,255,0.03)',
};
