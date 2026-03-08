import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type HealthLevel = 'ok' | 'warning' | 'danger';

export interface AgentRuntimeView {
  agentId: string;
  sessionsCount: number;
  lastActiveAgeMs?: number;
  lastModel?: string;
  recentPercentUsed?: number | null;
  health: HealthLevel;
  healthLabel: string;
  issues: string[];
}

export interface RuntimeSignal {
  gatewayReachable: boolean;
  activeSessions: number;
  defaultAgentActiveAgo?: string;
  health: HealthLevel;
  healthLabel: string;
  agents: AgentRuntimeView[];
}

export async function getRuntimeSignal(): Promise<RuntimeSignal> {
  try {
    const { stdout } = await execFileAsync('openclaw', ['status', '--json'], {
      cwd: '/home/jarvis/.openclaw/workspace',
      timeout: 20000,
      maxBuffer: 1024 * 1024,
    });
    const parsed = JSON.parse(stdout) as any;
    const sessionsByAgent = parsed?.sessions?.byAgent || [];
    const agents = (parsed?.agents?.agents || []).map((agent: any) => {
      const runtimeMatch = sessionsByAgent.find((entry: any) => entry.agentId === agent.id);
      const recent = runtimeMatch?.recent?.[0];
      const sessionsCount = Number(agent.sessionsCount || runtimeMatch?.count || 0);
      const lastActiveAgeMs = agent.lastActiveAgeMs;
      const recentPercentUsed = recent?.percentUsed ?? null;
      const { health, healthLabel, issues } = getAgentHealth({ sessionsCount, lastActiveAgeMs, recentPercentUsed, gatewayReachable: Boolean(parsed?.gateway?.reachable ?? true) });
      return {
        agentId: agent.id,
        sessionsCount,
        lastActiveAgeMs,
        lastModel: recent?.model,
        recentPercentUsed,
        health,
        healthLabel,
        issues,
      } as AgentRuntimeView;
    });

    const gatewayReachable = Boolean(parsed?.gateway?.reachable ?? true);
    const overallHealth = !gatewayReachable
      ? { health: 'danger' as HealthLevel, healthLabel: 'critique' }
      : agents.some((agent: AgentRuntimeView) => agent.health === 'danger')
        ? { health: 'danger' as HealthLevel, healthLabel: 'critique' }
        : agents.some((agent: AgentRuntimeView) => agent.health === 'warning')
          ? { health: 'warning' as HealthLevel, healthLabel: 'attention' }
          : { health: 'ok' as HealthLevel, healthLabel: 'ok' };

    return {
      gatewayReachable,
      activeSessions: Number(parsed?.sessions?.count ?? 0),
      defaultAgentActiveAgo: parsed?.agents?.agents?.find((a: any) => a.id === parsed?.agents?.defaultId)?.lastActiveAgeMs?.toString(),
      health: overallHealth.health,
      healthLabel: overallHealth.healthLabel,
      agents,
    };
  } catch {
    return {
      gatewayReachable: false,
      activeSessions: 0,
      health: 'danger',
      healthLabel: 'critique',
      agents: [],
    };
  }
}

export function findAgentRuntime(runtime: RuntimeSignal, agentId: string) {
  return runtime.agents.find((agent) => agent.agentId === agentId);
}

export function formatAge(ageMs?: number) {
  if (!ageMs && ageMs !== 0) return 'inconnu';
  const minutes = Math.floor(ageMs / 60000);
  if (minutes < 1) return 'à l’instant';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}

function getAgentHealth({
  sessionsCount,
  lastActiveAgeMs,
  recentPercentUsed,
  gatewayReachable,
}: {
  sessionsCount: number;
  lastActiveAgeMs?: number;
  recentPercentUsed?: number | null;
  gatewayReachable: boolean;
}): { health: HealthLevel; healthLabel: string; issues: string[] } {
  const issues: string[] = [];

  if (!gatewayReachable) issues.push('gateway indisponible');
  if ((recentPercentUsed ?? 0) >= 95) issues.push('contexte presque saturé');
  if ((recentPercentUsed ?? 0) >= 85 && (recentPercentUsed ?? 0) < 95) issues.push('contexte élevé');
  if ((lastActiveAgeMs ?? 0) > 1000 * 60 * 60 * 12) issues.push('activité ancienne');
  if ((lastActiveAgeMs ?? 0) > 1000 * 60 * 60 * 24) issues.push('activité très ancienne');
  if (sessionsCount === 0) issues.push('aucune session active');

  if (!gatewayReachable || (recentPercentUsed ?? 0) >= 95 || (lastActiveAgeMs ?? 0) > 1000 * 60 * 60 * 24) {
    return { health: 'danger', healthLabel: 'critique', issues };
  }

  if ((recentPercentUsed ?? 0) >= 85 || (lastActiveAgeMs ?? 0) > 1000 * 60 * 60 * 12 || sessionsCount === 0) {
    return { health: 'warning', healthLabel: 'attention', issues };
  }

  return { health: 'ok', healthLabel: 'ok', issues };
}
