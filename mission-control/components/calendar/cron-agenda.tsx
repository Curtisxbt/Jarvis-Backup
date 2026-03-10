import { Card } from '@/components/layout/card';
import { LinkedEntities } from '@/components/shared/linked-entities';
import { RunCronButton } from '@/components/actions/run-cron-button';
import { ToggleCronButton } from '@/components/actions/toggle-cron-button';
import { QuickTaskButton } from '@/components/actions/quick-task-button';
import { CronRunHistory } from '@/components/calendar/cron-run-history';
import { CronJobView } from '@/lib/cron/openclaw';

type LinkedItem = { id: string; label: string; meta: string; href?: string };

export function CronAgenda({ jobs, linkedTasks = {}, focusJobId }: { jobs: CronJobView[]; linkedTasks?: Record<string, LinkedItem[]>; focusJobId?: string }) {
  const groups = [
    { key: 'yesterday', label: 'Hier' },
    { key: 'today', label: 'Aujourd’hui' },
    { key: 'tomorrow', label: 'Demain' },
    { key: 'later', label: 'Plus tard' },
    { key: 'unknown', label: 'Sans horaire lisible' },
  ] as const;

  return (
    <div className="grid cols-2">
      {groups.map((group) => {
        const items = jobs.filter((job) => job.timingBucket === group.key);
        return (
          <Card key={group.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{group.label}</h3>
              <span className="badge">{items.length}</span>
            </div>
            <div className="grid">
              {items.length === 0 ? <div className="muted">Aucun job dans cette fenêtre.</div> : null}
              {items.map((job) => (
                <div key={job.id} className={focusJobId === job.id ? 'focus-card' : undefined} style={rowStyle}>
                  <div>
                    <strong>{job.name}</strong>
                    <div className="muted code">{job.agentId || 'défaut'} · {job.schedule} · {job.source}</div>
                    {group.key === 'yesterday'
                      ? <div className="muted">Exécution d’hier : <strong style={{ color: 'var(--text)' }}>{job.lastRunAt ? new Date(job.lastRunAt).toLocaleString('fr-FR') : 'non détectée'}</strong></div>
                      : job.nextRunAt ? <div className="muted">Prochain run : {new Date(job.nextRunAt).toLocaleString('fr-FR')}</div> : null}
                    <div className="muted">Santé : <strong style={{ color: 'var(--text)' }}>{job.healthLabel}</strong></div>
                    <div className="muted">Runs récents : <strong style={{ color: 'var(--text)' }}>OK {job.successCount} · KO {job.failureCount}</strong></div>
                    {job.healthReasons.length ? <div className="muted code">{job.healthReasons.join(' · ')}</div> : null}
                    <LinkedEntities title="Tâches liées" items={linkedTasks[job.id] || []} />
                    <CronRunHistory runs={job.recentRuns} />
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      <RunCronButton jobId={job.id} />
                      <ToggleCronButton jobId={job.id} enabled={job.enabled !== false} />
                      <QuickTaskButton title={`Suivi cron · ${job.name}`} description={job.description} relatedCronIds={[job.id]} />
                    </div>
                  </div>
                  <span className="badge">{translateStatus(job.lastStatus)}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function translateStatus(status?: string) {
  if (status === 'ok') return 'OK';
  if (status === 'error' || status === 'failed') return 'Erreur';
  return 'En attente';
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'flex-start',
  paddingBottom: 12,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};
