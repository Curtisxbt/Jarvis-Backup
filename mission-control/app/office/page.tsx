import office from '@/data/office.json';
import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { OfficeRadar } from '@/components/office/office-radar';
import { getTasks } from '@/lib/tasks/store';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { findAgentRuntime, formatAge, getRuntimeSignal } from '@/lib/agents/runtime';

export default async function OfficePage() {
  const [tasks, cronJobs, memoryDocs, runtime] = await Promise.all([getTasks(), getCronJobs(), getMemoryDocuments(), getRuntimeSignal()]);
  const seats = (office as Array<{ id: string; agentId: string; label: string; status: string }>).map((seat) => {
    const agentRuntime = findAgentRuntime(runtime, seat.agentId);
    const matchingCron = cronJobs.find((job) => (job.agentId || '').toLowerCase() === seat.agentId);
    const hasBlockedTasks = tasks.some((task) => task.owner.toLowerCase() === seat.agentId && task.status === 'blocked');
    const visualState = !runtime.gatewayReachable
      ? 'critical'
      : hasBlockedTasks || agentRuntime?.health === 'danger' || matchingCron?.health === 'danger'
        ? 'critical'
        : seat.agentId === 'jocko' && seat.status === 'idle'
          ? 'meditation'
          : seat.status === 'working'
            ? 'working'
            : seat.status === 'scheduled'
              ? 'scheduled'
              : seat.status === 'online'
                ? 'online'
                : 'idle';

    return {
      ...seat,
      status: runtime.gatewayReachable ? seat.status : 'blocked',
      visualState,
      openTasks: tasks.filter((task) => task.owner.toLowerCase() === seat.agentId && task.status !== 'done').length,
      blockedTasks: tasks.filter((task) => task.owner.toLowerCase() === seat.agentId && task.status === 'blocked').length,
      nextCron: matchingCron?.name,
      latestMemory: memoryDocs.find((doc) => doc.agent === seat.agentId)?.title,
      sessionAge: formatAge(agentRuntime?.lastActiveAgeMs),
      lastModel: agentRuntime?.lastModel,
      runtimeHealth: agentRuntime?.healthLabel,
      runtimeIssues: agentRuntime?.issues,
      cronHealth: matchingCron?.healthLabel,
      cronIssues: matchingCron?.healthReasons,
    };
  });

  return (
    <>
      <PageHeader title="Bureau" description="Radar visuel d’activité, runtime et contrôle rapide pour l’organisation des agents." />
      <div className="grid cols-3">
        <Card>
          <div className="muted">Postes</div>
          <div className="kpi">{seats.length}</div>
        </Card>
        <Card>
          <div className="muted">Sessions actives</div>
          <div className="kpi">{runtime.activeSessions}</div>
        </Card>
        <Card>
          <div className="muted">Gateway</div>
          <div className="kpi">{runtime.gatewayReachable ? 'OK' : 'DOWN'}</div>
          <div className="muted">Santé globale : <strong style={{ color: 'var(--text)' }}>{runtime.healthLabel}</strong></div>
        </Card>
      </div>
      <div style={{ marginTop: 18 }}>
        <OfficeRadar seats={seats} />
      </div>
    </>
  );
}
