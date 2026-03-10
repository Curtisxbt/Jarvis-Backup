'use client';

interface CronFiltersState {
  agent: string;
  status: string;
  bucket: string;
}

export function CronFilters({
  filters,
  agents,
  onChange,
}: {
  filters: CronFiltersState;
  agents: string[];
  onChange: (next: CronFiltersState) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <select value={filters.agent} onChange={(e) => onChange({ ...filters, agent: e.target.value })} style={inputStyle}>
        <option value="">Tous les agents</option>
        {agents.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
      </select>
      <select value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })} style={inputStyle}>
        <option value="">Tous les états</option>
        <option value="ok">OK</option>
        <option value="pending">En attente</option>
        <option value="error">Erreur</option>
      </select>
      <select value={filters.bucket} onChange={(e) => onChange({ ...filters, bucket: e.target.value })} style={inputStyle}>
        <option value="">Toutes les échéances</option>
        <option value="yesterday">Hier</option>
        <option value="today">Aujourd’hui</option>
        <option value="tomorrow">Demain</option>
        <option value="later">Plus tard</option>
        <option value="unknown">Inconnue</option>
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
