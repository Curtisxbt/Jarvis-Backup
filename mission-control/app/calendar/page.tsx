import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { CronTable } from '@/components/calendar/cron-table';
import { getCronJobs } from '@/lib/cron/openclaw';

export default async function CalendarPage() {
  const jobs = await getCronJobs();
  const daily = jobs.filter((job) => job.schedule.split(' ').length >= 5).length;
  const healthy = jobs.filter((job) => job.lastStatus === 'ok').length;

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Operational view of OpenClaw cron jobs, cadence, and automation status."
      />
      <div className="grid cols-3">
        <Card>
          <div className="muted">Active jobs</div>
          <div className="kpi">{jobs.length}</div>
        </Card>
        <Card>
          <div className="muted">Healthy last runs</div>
          <div className="kpi">{healthy}</div>
        </Card>
        <Card>
          <div className="muted">Scheduled jobs</div>
          <div className="kpi">{daily}</div>
        </Card>
      </div>
      <div style={{ marginTop: 18 }}>
        <CronTable jobs={jobs} />
      </div>
    </>
  );
}
