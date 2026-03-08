import { Card } from '@/components/layout/card';
import { CronJobView } from '@/lib/cron/openclaw';

export function CronTable({ jobs }: { jobs: CronJobView[] }) {
  return (
    <Card>
      <h3>OpenClaw cron jobs</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Agent</th>
            <th>Schedule</th>
            <th>Next run</th>
            <th>Last run</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <div>{job.name}</div>
                <div className="muted code">{job.description || job.id}</div>
              </td>
              <td>{job.agentId || 'default'}</td>
              <td>
                <div className="code">{job.schedule}</div>
                <div className="muted">{job.timezone || 'local'}</div>
              </td>
              <td>{job.nextRunAt ? new Date(job.nextRunAt).toLocaleString('fr-FR') : '—'}</td>
              <td>{job.lastRunAt ? new Date(job.lastRunAt).toLocaleString('fr-FR') : '—'}</td>
              <td><span className="badge">{job.lastStatus || 'pending'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
