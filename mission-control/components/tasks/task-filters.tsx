'use client';

import { TaskPriority, TaskStatus } from '@/lib/tasks/types';

interface TaskFiltersState {
  query: string;
  owner: string;
  status: string;
  priority: string;
  category: string;
}

export function TaskFilters({
  filters,
  categories,
  onChange,
}: {
  filters: TaskFiltersState;
  categories: string[];
  onChange: (next: TaskFiltersState) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <input
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
        placeholder="Rechercher une tâche"
        style={inputStyle}
      />
      <select value={filters.owner} onChange={(e) => onChange({ ...filters, owner: e.target.value })} style={inputStyle}>
        <option value="">Tous les responsables</option>
        <option value="Denis">Denis</option>
        <option value="Elon">Elon</option>
        <option value="Jocko">Jocko</option>
      </select>
      <select value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })} style={inputStyle}>
        <option value="">Tous les statuts</option>
        <option value="backlog">Backlog</option>
        <option value="in_progress">En cours</option>
        <option value="blocked">Bloqué</option>
        <option value="done">Terminé</option>
      </select>
      <select value={filters.priority} onChange={(e) => onChange({ ...filters, priority: e.target.value })} style={inputStyle}>
        <option value="">Toutes les priorités</option>
        <option value="low">Basse</option>
        <option value="medium">Moyenne</option>
        <option value="high">Haute</option>
      </select>
      <select value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value })} style={inputStyle}>
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '10px 12px',
  minWidth: 170,
};
