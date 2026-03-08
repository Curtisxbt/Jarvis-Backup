'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const agents = [
  { value: '', label: 'Tous les agents' },
  { value: 'elon', label: 'Elon' },
  { value: 'jocko', label: 'Jocko' },
  { value: 'shared', label: 'Partagé' },
];

const kinds = [
  { value: '', label: 'Tous les types de mémoire' },
  { value: 'daily', label: 'Quotidienne' },
  { value: 'durable', label: 'Durable' },
  { value: 'handoff', label: 'Passation' },
];

export function MemoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <input
        placeholder="Rechercher dans la mémoire"
        defaultValue={searchParams.get('q') ?? ''}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          update('q', (event.target as HTMLInputElement).value);
        }}
        style={inputStyle}
      />
      <select defaultValue={searchParams.get('agent') ?? ''} onChange={(e) => update('agent', e.target.value)} style={inputStyle}>
        {agents.map((agent) => (
          <option key={agent.value} value={agent.value}>{agent.label}</option>
        ))}
      </select>
      <select defaultValue={searchParams.get('kind') ?? ''} onChange={(e) => update('kind', e.target.value)} style={inputStyle}>
        {kinds.map((kind) => (
          <option key={kind.value} value={kind.value}>{kind.label}</option>
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
  minWidth: 180,
};
