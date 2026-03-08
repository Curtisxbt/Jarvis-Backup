'use client';

import { useMemo } from 'react';
import { TaskItem, TaskStatus } from '@/lib/tasks/types';
import { Card } from '@/components/layout/card';

const columns: Array<{ key: TaskStatus; label: string }> = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'blocked', label: 'Bloqué' },
  { key: 'done', label: 'Terminé' },
];

export function TaskBoard({
  tasks,
  onStatusChange,
}: {
  tasks: TaskItem[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  const grouped = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.status === column.key),
    }));
  }, [tasks]);

  return (
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
                  <span className="badge">{translatePriority(task.priority)}</span>
                  <span className="badge">{task.category}</span>
                </div>
                <strong>{task.title}</strong>
                {task.description ? <p className="muted">{task.description}</p> : null}
                {task.notes ? <p className="muted">{task.notes}</p> : null}
                <div className="muted code">Mis à jour le {new Date(task.updatedAt).toLocaleString('fr-FR')}</div>
                {task.dueAt ? <div className="muted code">Échéance : {task.dueAt}</div> : null}
                <div style={{ marginTop: 10 }}>
                  <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)} style={inputStyle}>
                    {columns.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function translatePriority(priority: 'low' | 'medium' | 'high') {
  if (priority === 'low') return 'Basse';
  if (priority === 'high') return 'Haute';
  return 'Moyenne';
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '10px 12px',
  minWidth: 160,
};

const taskCardStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 14,
  background: 'rgba(255,255,255,0.03)',
};
