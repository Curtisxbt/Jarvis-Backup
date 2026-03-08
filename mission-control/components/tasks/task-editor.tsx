'use client';

import { useMemo, useState } from 'react';
import { TaskItem, TaskPriority, TaskStatus } from '@/lib/tasks/types';

type LinkableItem = {
  id: string;
  label: string;
  meta: string;
};

const owners = ['Denis', 'Elon', 'Jocko'];
const statuses: Array<{ value: TaskStatus; label: string }> = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'blocked', label: 'Bloqué' },
  { value: 'done', label: 'Terminé' },
];
const priorities: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
];

export function TaskEditor({
  task,
  memoryOptions,
  cronOptions,
  onSaved,
  onArchive,
}: {
  task: TaskItem;
  memoryOptions: LinkableItem[];
  cronOptions: LinkableItem[];
  onSaved: (tasks: TaskItem[]) => void;
  onArchive: (tasks: TaskItem[]) => void;
}) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    owner: task.owner,
    priority: task.priority,
    category: task.category,
    status: task.status,
    notes: task.notes || '',
    dueAt: task.dueAt || '',
    relatedMemoryIds: task.relatedMemoryIds || [],
    relatedCronIds: task.relatedCronIds || [],
  });
  const [saving, setSaving] = useState(false);

  const selectedMemory = useMemo(
    () => memoryOptions.filter((item) => form.relatedMemoryIds.includes(item.id)),
    [form.relatedMemoryIds, memoryOptions],
  );
  const selectedCron = useMemo(
    () => cronOptions.filter((item) => form.relatedCronIds.includes(item.id)),
    [cronOptions, form.relatedCronIds],
  );

  async function save() {
    setSaving(true);
    const response = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        ...form,
        dueAt: form.dueAt || null,
      }),
    });
    const data = await response.json();
    onSaved(data.tasks);
    setSaving(false);
  }

  async function archive() {
    const response = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, archived: true }),
    });
    const data = await response.json();
    onArchive(data.tasks);
  }

  return (
    <div className="task-editor-grid">
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
      <select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} style={inputStyle}>
        {owners.map((owner) => <option key={owner}>{owner}</option>)}
      </select>
      <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })} style={inputStyle}>
        {priorities.map((priority) => <option key={priority.value} value={priority.value}>{priority.label}</option>)}
      </select>
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })} style={inputStyle}>
        {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
      </select>
      <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Catégorie" style={inputStyle} />
      <input value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} placeholder="Échéance (ISO ou texte)" style={inputStyle} />
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" style={textareaStyle} />
      <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" style={textareaStyle} />

      <div>
        <div className="muted" style={{ marginBottom: 6 }}>Lier à une mémoire</div>
        <select
          style={inputStyle}
          onChange={(e) => {
            if (!e.target.value) return;
            if (form.relatedMemoryIds.includes(e.target.value)) return;
            setForm({ ...form, relatedMemoryIds: [...form.relatedMemoryIds, e.target.value] });
            e.target.value = '';
          }}
          defaultValue=""
        >
          <option value="">Ajouter une mémoire liée</option>
          {memoryOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {selectedMemory.map((item) => (
            <button key={item.id} style={chipButtonStyle} onClick={() => setForm({ ...form, relatedMemoryIds: form.relatedMemoryIds.filter((id) => id !== item.id) })}>
              {item.label} ×
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="muted" style={{ marginBottom: 6 }}>Lier à un cron</div>
        <select
          style={inputStyle}
          onChange={(e) => {
            if (!e.target.value) return;
            if (form.relatedCronIds.includes(e.target.value)) return;
            setForm({ ...form, relatedCronIds: [...form.relatedCronIds, e.target.value] });
            e.target.value = '';
          }}
          defaultValue=""
        >
          <option value="">Ajouter un cron lié</option>
          {cronOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {selectedCron.map((item) => (
            <button key={item.id} style={chipButtonStyle} onClick={() => setForm({ ...form, relatedCronIds: form.relatedCronIds.filter((id) => id !== item.id) })}>
              {item.label} ×
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={save} style={buttonStyle} disabled={saving}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
        <button onClick={archive} style={ghostDangerStyle}>Archiver</button>
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

const ghostDangerStyle: React.CSSProperties = {
  border: '1px solid rgba(239,68,68,0.4)',
  background: 'rgba(239,68,68,0.08)',
  color: '#fecaca',
  borderRadius: 12,
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const chipButtonStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  borderRadius: 999,
  padding: '6px 10px',
  cursor: 'pointer',
};
