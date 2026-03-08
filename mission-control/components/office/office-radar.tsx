import Link from 'next/link';
import { QuickTaskButton } from '@/components/actions/quick-task-button';

type OfficeRadarItem = {
  id: string;
  label: string;
  agentId: string;
  status: string;
  openTasks: number;
  nextCron?: string;
  latestMemory?: string;
  sessionAge?: string;
  lastModel?: string;
};

const statusColor: Record<string, string> = {
  working: 'var(--success)',
  scheduled: 'var(--warning)',
  blocked: 'var(--danger)',
  idle: 'var(--muted)',
  online: 'var(--accent)',
};

export function OfficeRadar({ seats }: { seats: OfficeRadarItem[] }) {
  return (
    <div className="grid cols-2">
      {seats.map((seat) => (
        <section key={seat.id} className="card office-seat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{seat.label}</h3>
            <span className="badge">{translateStatus(seat.status)}</span>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 130 }}>
            <div style={{ position: 'relative', width: 150, height: 110 }}>
              <div style={{ position: 'absolute', bottom: 0, left: 18, width: 108, height: 18, borderRadius: 10, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'absolute', bottom: 18, left: 50, width: 48, height: 48, borderRadius: '50%', background: statusColor[seat.status] || 'var(--muted)', boxShadow: '0 0 24px rgba(110,168,254,0.18)' }} />
              <div style={{ position: 'absolute', bottom: 62, left: 61, width: 26, height: 26, borderRadius: '50%', background: '#f8fafc' }} />
              <div style={{ position: 'absolute', right: 8, bottom: 24, width: 44, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(110,168,254,0.15)' }} />
            </div>
          </div>
          <div className="grid" style={{ gap: 8 }}>
            <div className="muted">Agent : <strong style={{ color: 'var(--text)' }}>{seat.agentId}</strong></div>
            <div className="muted">Tâches ouvertes : <strong style={{ color: 'var(--text)' }}>{seat.openTasks}</strong></div>
            <div className="muted">Prochain cron : <strong style={{ color: 'var(--text)' }}>{seat.nextCron || 'Aucun'}</strong></div>
            <div className="muted">Dernière mémoire : <strong style={{ color: 'var(--text)' }}>{seat.latestMemory || 'Aucune'}</strong></div>
            <div className="muted">Dernière activité : <strong style={{ color: 'var(--text)' }}>{seat.sessionAge || 'inconnue'}</strong></div>
            <div className="muted">Modèle : <strong style={{ color: 'var(--text)' }}>{seat.lastModel || 'inconnu'}</strong></div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <Link href={`/tasks?owner=${encodeURIComponent(capitalize(seat.agentId))}`} className="badge badge-link">Tâches</Link>
            <Link href="/calendar" className="badge badge-link">Calendrier</Link>
            <Link href={`/memory?agent=${encodeURIComponent(seat.agentId)}`} className="badge badge-link">Mémoire</Link>
          </div>
          <div style={{ marginTop: 12 }}>
            <QuickTaskButton title={`Action ${capitalize(seat.agentId)}`} description={`Suivi bureau ${seat.label}`} owner={capitalize(seat.agentId)} />
          </div>
        </section>
      ))}
    </div>
  );
}

function translateStatus(status: string) {
  if (status === 'working') return 'en activité';
  if (status === 'scheduled') return 'planifié';
  if (status === 'blocked') return 'bloqué';
  if (status === 'idle') return 'inactif';
  if (status === 'online') return 'en ligne';
  return status;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
