import { PageHeader } from '@/components/layout/page-header';
import { OverviewKpis } from '@/components/overview/overview-kpis';
import { RecentMemory } from '@/components/overview/recent-memory';
import { AgentActivity } from '@/components/overview/agent-activity';
import { QuickActions } from '@/components/overview/quick-actions';
import { AlertsPanel } from '@/components/overview/alerts-panel';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { getAgentProfiles } from '@/lib/agents/registry';
import { getRuntimeSignal } from '@/lib/agents/runtime';
import { buildAlerts } from '@/lib/alerts/engine';

export default async function HomePage() {
  const [cronJobs, memoryDocs, runtime] = await Promise.all([
    getCronJobs(),
    getMemoryDocuments(),
    getRuntimeSignal(),
  ]);
  const team = getAgentProfiles();

  const recentMemories = memoryDocs.slice(0, 5).map((doc) => ({
    ...doc,
    href: `/memory?docId=${encodeURIComponent(doc.id)}`,
  }));
  const activeAgents = team.filter((member) => member.status === 'working' || member.status === 'online').length;
  const todaysElonMemory = memoryDocs.some((doc) => doc.agent === 'elon' && doc.kind === 'daily' && doc.date === new Date().toISOString().slice(0, 10));

  const alerts = buildAlerts({
    cronJobs,
    todaysElonMemory,
    runtime,
  });

  return (
    <>
      <PageHeader
        title="Mission Control"
        description="Une seule surface de pilotage pour l’exécution, la mémoire, l’automatisation et la visibilité des agents."
      />

      <OverviewKpis
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
