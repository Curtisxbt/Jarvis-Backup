'use client';

import { useEffect, useState } from 'react';
import { TaskItem } from '@/lib/tasks/types';
import { TaskEditor } from '@/components/tasks/task-editor';
import { LinkedEntities } from '@/components/shared/linked-entities';

type LinkableItem = { id: string; label: string; meta: string; href?: string };

export function TaskTable({
  tasks,
  memoryOptions,
  cronOptions,
  onTasksChange,
  focusTaskId,
}: {
  tasks: TaskItem[];
  memoryOptions: LinkableItem[];
  cronOptions: LinkableItem[];
  onTasksChange: (tasks: TaskItem[]) => void;
  focusTaskId?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(focusTaskId || null);

  useEffect(() => {
    if (focusTaskId) setOpenId(focusTaskId);
  }, [focusTaskId]);

  return (
    <div className="card">
      <h3>Vue table</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Responsable</th>
            <th>Priorité</th>
            <th>Statut</th>
            <th>Catégorie</th>
            <th>Échéance</th>
            <th>Maj</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const linkedMemory = memoryOptions.filter((item) => (task.relatedMemoryIds || []).includes(item.id));
            const linkedCron = cronOptions.filter((item) => (task.relatedCronIds || []).includes(item.id));
            const focused = openId === task.id;
            return (
              <>
                <tr key={task.id} className={focused ? 'row-focus' : undefined}>
                  <td>
                    <div>{task.title}</div>
                    {task.description ? <div className="muted">{task.description}</div> : null}
                    <LinkedEntities title="Mémoire liée" items={linkedMemory} />
                    <LinkedEntities title="Cron lié" items={linkedCron} />
                  </td>
                  <td>{task.owner}</td>
                  <td>{translatePriority(task.priority)}</td>
                  <td>{translateStatus(task.status)}</td>
                  <td>{task.category}</td>
                  <td>{task.dueAt || '—'}</td>
                  <td>{new Date(task.updatedAt).toLocaleString('fr-FR')}</td>
                  <td>
                    <button onClick={() => setOpenId(openId === task.id ? null : task.id)} style={linkButtonStyle}>
                      {openId === task.id ? 'Fermer' : 'Éditer'}
                    </button>
                  </td>
                </tr>
                {openId === task.id ? (
                  <tr key={`${task.id}-editor`}>
                    <td colSpan={8}>
                      <TaskEditor
                        task={task}
                        memoryOptions={memoryOptions}
                        cronOptions={cronOptions}
                        onSaved={(next) => {
                          onTasksChange(next);
                          setOpenId(null);
                        }}
                        onArchive={(next) => {
                          onTasksChange(next);
                          setOpenId(null);
                        }}
                      />
                    </td>
                  </tr>
                ) : null}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function translatePriority(priority: string) {
  if (priority === 'low') return 'Basse';
  if (priority === 'high') return 'Haute';
  return 'Moyenne';
}

function translateStatus(status: string) {
  if (status === 'in_progress') return 'En cours';
  if (status === 'blocked') return 'Bloqué';
  if (status === 'done') return 'Terminé';
  return 'Backlog';
}

const linkButtonStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  borderRadius: 10,
  padding: '8px 10px',
  cursor: 'pointer',
};
