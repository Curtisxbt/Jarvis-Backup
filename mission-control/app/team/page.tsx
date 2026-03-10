import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { TeamSummary } from '@/components/team/team-summary';
import { getAgentProfiles } from '@/lib/agents/registry';
import { getTasks } from '@/lib/tasks/store';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { findAgentRuntime, formatAge, getRuntimeSignal } from '@/lib/agents/runtime';

const execFileAsync = promisify(execFile);

export default async function TeamPage() {
  const [team, tasks, cronJobs, memoryDocs, runtime, pm2Apps] = await Promise.all([
    Promise.resolve(getAgentProfiles()),
    getTasks(),
    getCronJobs(),
    getMemoryDocuments(),
    getRuntimeSignal(),
    getPm2Apps(),
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
      <div style={{ marginTop: 18 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h3>Processus PM2</h3>
            <span className="badge">{pm2Apps.length}</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Statut</th>
                <th>CPU</th>
                <th>Mémoire</th>
                <th>Redémarrages</th>
              </tr>
            </thead>
            <tbody>
              {pm2Apps.map((app) => (
                <tr key={app.name}>
                  <td>{app.name}</td>
                  <td><span className="badge">{app.status}</span></td>
                  <td>{app.cpu}%</td>
                  <td>{app.memoryMb} MB</td>
                  <td>{app.restarts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}

async function getPm2Apps() {
  try {
    const { stdout } = await execFileAsync('pm2', ['jlist'], {
      cwd: '/home/jarvis/.openclaw/workspace',
      timeout: 10000,
      maxBuffer: 2 * 1024 * 1024,
    });

    const parsed = JSON.parse(stdout) as Array<any>;
    return parsed.map((app) => ({
      name: app.name,
      status: app.pm2_env?.status || 'unknown',
      cpu: Number(app.monit?.cpu ?? 0),
      memoryMb: Math.round((app.monit?.memory ?? 0) / 1024 / 1024),
      restarts: app.pm2_env?.restart_time ?? 0,
    }));
  } catch {
    return [];
  }
}
