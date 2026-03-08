import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface CronJobView {
  id: string;
  name: string;
  description?: string;
  agentId?: string;
  schedule: string;
  timezone?: string;
  nextRunAt?: string;
  lastRunAt?: string;
  lastStatus?: string;
  sessionTarget?: string;
  deliveryMode?: string;
}

interface CronListResponse {
  jobs: Array<{
    id: string;
    name: string;
    description?: string;
    agentId?: string;
    sessionTarget?: string;
    schedule?: { kind?: string; expr?: string; tz?: string };
    delivery?: { mode?: string };
    state?: {
      nextRunAtMs?: number;
      lastRunAtMs?: number;
      lastStatus?: string;
      lastRunStatus?: string;
    };
  }>;
}

export async function getCronJobs(): Promise<CronJobView[]> {
  const { stdout } = await execFileAsync('openclaw', ['cron', 'list', '--json'], {
    cwd: '/home/jarvis/.openclaw/workspace',
    timeout: 20000,
    maxBuffer: 1024 * 1024,
  });

  const parsed = JSON.parse(stdout) as CronListResponse;
  return (parsed.jobs || []).map((job) => ({
    id: job.id,
    name: job.name,
    description: job.description,
    agentId: job.agentId,
    schedule: job.schedule?.expr || 'n/a',
    timezone: job.schedule?.tz,
    nextRunAt: job.state?.nextRunAtMs ? new Date(job.state.nextRunAtMs).toISOString() : undefined,
    lastRunAt: job.state?.lastRunAtMs ? new Date(job.state.lastRunAtMs).toISOString() : undefined,
    lastStatus: job.state?.lastStatus || job.state?.lastRunStatus,
    sessionTarget: job.sessionTarget,
    deliveryMode: job.delivery?.mode,
  }));
}
