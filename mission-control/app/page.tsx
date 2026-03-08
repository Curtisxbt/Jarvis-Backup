import { PageHeader } from '@/components/layout/page-header';
import { OverviewKpis } from '@/components/overview/overview-kpis';
import { RecentMemory } from '@/components/overview/recent-memory';
import { AgentActivity } from '@/components/overview/agent-activity';
import { QuickActions } from '@/components/overview/quick-actions';
import { AlertsPanel } from '@/components/overview/alerts-panel';
import { getTasks } from '@/lib/tasks/store';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { getAgentProfiles } from '@/lib/agents/registry';
import { getTaskRelations } from '@/lib/links/resolve';
import { getRuntimeSignal } from '@/lib/agents/runtime';
import { buildAlerts } from '@/lib/alerts/engine';

export default async function HomePage() {
  const [tasks, cronJobs, memoryDocs, relations, runtime] = await Promise.all([
    getTasks(),
    getCronJobs(),
    getMemoryDocuments(),
    getTaskRelations(),
    getRuntimeSignal(),
  ]);
  const team = getAgentProfiles();

  const recentMemories = memoryDocs.slice(0, 5).map((doc) => ({
    ...doc,
    href: `/memory?docId=${encodeURIComponent(doc.id)}`,
  }));
  const activeAgents = team.filter((member) => member.status === 'working' || member.status === 'online').length;
  const todaysElonMemory = memoryDocs.some((doc) => doc.agent === 'elon' && doc.kind === 'daily' && doc.date === new Date().toISOString().slice(0, 10));
  const orphanCrons = cronJobs.filter((job) => !(relations.tasksByCronId.get(job.id) || []).length);

  const alerts = buildAlerts({
    tasks,
    cronJobs,
    todaysElonMemory,
    orphanCronCount: orphanCrons.length,
    runtime,
  });

  return (
    <>
      <PageHeader
        title="Mission Control"
        description="Une seule surface de pilotage pour l’exécution, la mémoire, l’automatisation et la visibilité des agents."
      />

      <OverviewKpis
        openTasks={tasks.filter((task) => task.status !== 'done').length}
        blockedTasks={tasks.filter((task) => task.status === 'blocked').length}
        activeCronJobs={cronJobs.length}
        cronHealthy={cronJobs.filter((job) => job.lastStatus === 'ok').length}
        recentMemories={recentMemories.length}
        activeAgents={activeAgents}
      />

      <div className="grid cols-2" style={{ marginTop: 18 }}>
        <AlertsPanel alerts={alerts} />
        <RecentMemory docs={recentMemories} />
      </div>

      <div className="grid cols-2" style={{ marginTop: 18 }}>
        <AgentActivity team={team} />
        <QuickActions />
      </div>
    </>
  );
}
