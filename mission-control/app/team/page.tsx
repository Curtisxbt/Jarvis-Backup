import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { TeamSummary } from '@/components/team/team-summary';
import { getAgentProfiles } from '@/lib/agents/registry';
import { getTasks } from '@/lib/tasks/store';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { findAgentRuntime, formatAge, getRuntimeSignal } from '@/lib/agents/runtime';

export default async function TeamPage() {
  const [team, tasks, cronJobs, memoryDocs, runtime] = await Promise.all([
    Promise.resolve(getAgentProfiles()),
    getTasks(),
    getCronJobs(),
    getMemoryDocuments(),
    getRuntimeSignal(),
  ]);

  const summary = team.map((member) => {
    const agentRuntime = findAgentRuntime(runtime, member.id);
    return {
      id: member.id,
      name: member.name,
      role: `${member.role}${agentRuntime?.sessionsCount ? ` · ${agentRuntime.sessionsCount} sessions` : ''}`,
      status: member.status,
      openTasks: tasks.filter((task) => task.owner === member.name && task.status !== 'done').length,
      blockedTasks: tasks.filter((task) => task.owner === member.name && task.status === 'blocked').length,
      cronCount: cronJobs.filter((job) => (job.agentId || '').toLowerCase() === member.id).length,
      latestMemory: memoryDocs.find((doc) => doc.agent === member.id)?.title,
      sessionAge: formatAge(agentRuntime?.lastActiveAgeMs),
      lastModel: agentRuntime?.lastModel,
      contextUsage: agentRuntime?.recentPercentUsed,
      runtimeHealth: agentRuntime?.healthLabel,
      runtimeIssues: agentRuntime?.issues,
    };
  });

  return (
    <>
      <PageHeader title="Équipe" description="Rôles, responsabilités, charge, sessions, modèle et posture opérationnelle à travers l’organisation humain + agents." />
      <div className="grid cols-3">
        <Card>
          <div className="muted">Membres actifs</div>
          <div className="kpi">{team.length}</div>
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
        <TeamSummary items={summary} />
      </div>
    </>
  );
}
