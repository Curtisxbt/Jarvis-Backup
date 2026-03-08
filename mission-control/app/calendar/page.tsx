import { PageHeader } from '@/components/layout/page-header';
import { CronStatusCards } from '@/components/calendar/cron-status-cards';
import { CalendarHub } from '@/components/calendar/calendar-hub';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getTaskRelations } from '@/lib/links/resolve';

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>;
}) {
  const params = await searchParams;
  const jobs = await getCronJobs({ includeRuns: false });
  const relations = await getTaskRelations({ cronJobs: jobs });

  const linkedTasks = Object.fromEntries(
    jobs.map((job) => [
      job.id,
      (relations.tasksByCronId.get(job.id) || []).map((task) => ({
        id: task.id,
        label: task.title,
        meta: `${task.owner} · ${task.category}`,
        href: `/tasks?taskId=${encodeURIComponent(task.id)}`,
      })),
    ]),
  );

  return (
    <>
      <PageHeader
        title="Calendrier"
        description="Vue opérationnelle des jobs cron OpenClaw, de leur cadence et de leur état d’automatisation."
      />
      <CronStatusCards
        total={jobs.length}
        healthy={jobs.filter((job) => job.lastStatus === 'ok').length}
        warning={jobs.filter((job) => job.health === 'warning').length}
        danger={jobs.filter((job) => job.health === 'danger').length}
        today={jobs.filter((job) => job.timingBucket === 'today').length}
        tomorrow={jobs.filter((job) => job.timingBucket === 'tomorrow').length}
        later={jobs.filter((job) => job.timingBucket === 'later').length}
        unknown={jobs.filter((job) => job.timingBucket === 'unknown').length}
      />
      <div style={{ marginTop: 18 }}>
        <CalendarHub jobs={jobs} linkedTasks={linkedTasks} focusJobId={params.jobId} />
      </div>
    </>
  );
}
