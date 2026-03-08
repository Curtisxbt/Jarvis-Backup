import { Card } from '@/components/layout/card';
import { LinkedEntities } from '@/components/shared/linked-entities';
import { RunCronButton } from '@/components/actions/run-cron-button';
import { ToggleCronButton } from '@/components/actions/toggle-cron-button';
import { QuickTaskButton } from '@/components/actions/quick-task-button';
import { CronRunHistory } from '@/components/calendar/cron-run-history';
import { CronJobView } from '@/lib/cron/openclaw';

type LinkedItem = { id: string; label: string; meta: string; href?: string };

export function CronTable({ jobs, linkedTasks = {}, focusJobId }: { jobs: CronJobView[]; linkedTasks?: Record<string, LinkedItem[]>; focusJobId?: string }) {
  return (
    <Card>
      <h3>Jobs cron OpenClaw</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Agent</th>
            <th>Planification</th>
            <th>Prochain run</th>
            <th>Dernier run</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className={focusJobId === job.id ? 'row-focus' : undefined}>
              <td>
                <div>{job.name}</div>
                <div className="muted code">{job.description || job.id}</div>
                <LinkedEntities title="Tâches liées" items={linkedTasks[job.id] || []} />
                <CronRunHistory runs={job.recentRuns} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  <RunCronButton jobId={job.id} />
                  <ToggleCronButton jobId={job.id} enabled={job.enabled !== false} />
                  <QuickTaskButton title={`Suivi cron · ${job.name}`} description={job.description} relatedCronIds={[job.id]} />
                </div>
              </td>
              <td>{job.agentId || 'défaut'}</td>
              <td>
                <div className="code">{job.schedule}</div>
                <div className="muted">{job.timezone || 'local'} · {translateBucket(job.timingBucket)}</div>
              </td>
              <td>{job.nextRunAt ? new Date(job.nextRunAt).toLocaleString('fr-FR') : '—'}</td>
              <td>
                {job.lastRunAt ? new Date(job.lastRunAt).toLocaleString('fr-FR') : '—'}
                {job.lastDurationMs ? <div className="muted code">{job.lastDurationMs} ms</div> : null}
              </td>
              <td><span className="badge">{translateStatus(job.lastStatus)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function translateStatus(status?: string) {
  if (status === 'ok') return 'OK';
  if (status === 'error' || status === 'failed') return 'Erreur';
  return 'En attente';
}

function translateBucket(bucket: string) {
  if (bucket === 'today') return 'aujourd’hui';
  if (bucket === 'tomorrow') return 'demain';
  if (bucket === 'later') return 'plus tard';
  return 'inconnu';
}
