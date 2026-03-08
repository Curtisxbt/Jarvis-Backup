import Link from 'next/link';
import { Card } from '@/components/layout/card';
import { QuickTaskButton } from '@/components/actions/quick-task-button';

type TeamSummaryItem = {
  id: string;
  name: string;
  role: string;
  status: string;
  openTasks: number;
  blockedTasks: number;
  cronCount: number;
  latestMemory?: string;
  sessionAge?: string;
  lastModel?: string;
  contextUsage?: number | null;
};

export function TeamSummary({ items }: { items: TeamSummaryItem[] }) {
  return (
    <div className="grid cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <h3>{item.name}</h3>
            <span className="badge">{translateStatus(item.status)}</span>
          </div>
          <div className="muted" style={{ marginBottom: 10 }}>{item.role}</div>
          <div className="grid" style={{ gap: 10 }}>
            <div className="muted">Tâches ouvertes : <strong style={{ color: 'var(--text)' }}>{item.openTasks}</strong></div>
            <div className="muted">Tâches bloquées : <strong style={{ color: 'var(--text)' }}>{item.blockedTasks}</strong></div>
            <div className="muted">Cron associés : <strong style={{ color: 'var(--text)' }}>{item.cronCount}</strong></div>
            <div className="muted">Dernière mémoire : <strong style={{ color: 'var(--text)' }}>{item.latestMemory || 'Aucune'}</strong></div>
            <div className="muted">Dernière activité : <strong style={{ color: 'var(--text)' }}>{item.sessionAge || 'inconnue'}</strong></div>
            <div className="muted">Modèle : <strong style={{ color: 'var(--text)' }}>{item.lastModel || 'inconnu'}</strong></div>
            <div className="muted">Contexte : <strong style={{ color: 'var(--text)' }}>{item.contextUsage != null ? `${item.contextUsage}%` : 'n/d'}</strong></div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <Link href={`/tasks?owner=${encodeURIComponent(item.name)}`} className="badge badge-link">Tâches</Link>
            <Link href={`/memory?agent=${encodeURIComponent(item.id)}`} className="badge badge-link">Mémoire</Link>
            <Link href="/calendar" className="badge badge-link">Cron</Link>
          </div>
          <div style={{ marginTop: 12 }}>
            <QuickTaskButton title={`Action ${item.name}`} description={`Suivi agent ${item.name}`} owner={item.name} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function translateStatus(status: string) {
  if (status === 'working') return 'en activité';
  if (status === 'scheduled') return 'planifié';
  if (status === 'online') return 'en ligne';
  if (status === 'blocked') return 'bloqué';
  if (status === 'idle') return 'inactif';
  return status;
}
