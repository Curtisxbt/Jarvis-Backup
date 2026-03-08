import Link from 'next/link';
import { Card } from '@/components/layout/card';
import { MemoryDocument } from '@/lib/memory/types';

export function RecentMemory({ docs }: { docs: Array<MemoryDocument & { href?: string }> }) {
  return (
    <Card>
      <h3>Dernières mémoires</h3>
      <div className="grid">
        {docs.map((doc) => (
          <div key={doc.id} style={rowStyle}>
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <span className="badge">{translateAgent(doc.agent)}</span>
                <span className="badge">{translateKind(doc.kind)}</span>
              </div>
              {doc.href ? (
                <Link href={doc.href} className="memory-link"><strong>{doc.title}</strong></Link>
              ) : (
                <strong>{doc.title}</strong>
              )}
              <div className="muted code">{doc.relativePath}</div>
            </div>
            <div className="muted code">{doc.date || new Date(doc.updatedAt).toLocaleDateString('fr-FR')}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function translateAgent(agent: string) {
  if (agent === 'shared') return 'Partagé';
  return agent.charAt(0).toUpperCase() + agent.slice(1);
}

function translateKind(kind: string) {
  if (kind === 'daily') return 'Quotidienne';
  if (kind === 'durable') return 'Durable';
  if (kind === 'handoff') return 'Passation';
  return kind;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'flex-start',
  paddingBottom: 12,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};
