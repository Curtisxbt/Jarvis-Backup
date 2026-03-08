import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface AgentRuntimeView {
  agentId: string;
  sessionsCount: number;
  lastActiveAgeMs?: number;
  lastModel?: string;
  recentPercentUsed?: number | null;
}

export interface RuntimeSignal {
  gatewayReachable: boolean;
  activeSessions: number;
  defaultAgentActiveAgo?: string;
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
      return {
        agentId: agent.id,
        sessionsCount: Number(agent.sessionsCount || runtimeMatch?.count || 0),
        lastActiveAgeMs: agent.lastActiveAgeMs,
        lastModel: recent?.model,
        recentPercentUsed: recent?.percentUsed ?? null,
      } as AgentRuntimeView;
    });

    return {
      gatewayReachable: Boolean(parsed?.gateway?.reachable ?? true),
      activeSessions: Number(parsed?.sessions?.count ?? 0),
      defaultAgentActiveAgo: parsed?.agents?.agents?.find((a: any) => a.id === parsed?.agents?.defaultId)?.lastActiveAgeMs?.toString(),
      agents,
    };
  } catch {
    return {
      gatewayReachable: false,
      activeSessions: 0,
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
