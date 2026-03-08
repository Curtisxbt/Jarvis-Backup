import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface CronRunView {
  jobId: string;
  startedAt?: string;
  finishedAt?: string;
  status?: string;
  durationMs?: number;
}

export interface CronJobView {
  id: string;
  name: string;
  description?: string;
  agentId?: string;
  enabled?: boolean;
  schedule: string;
  timezone?: string;
  nextRunAt?: string;
  lastRunAt?: string;
  lastStatus?: string;
  lastDurationMs?: number;
  recentRuns?: CronRunView[];
  sessionTarget?: string;
  deliveryMode?: string;
  timingBucket: 'today' | 'tomorrow' | 'later' | 'unknown';
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
      lastDurationMs?: number;
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
  const jobs = (parsed.jobs || []).map((job) => {
    const nextRunAt = job.state?.nextRunAtMs ? new Date(job.state.nextRunAtMs).toISOString() : undefined;
    return {
      id: job.id,
      name: job.name,
      description: job.description,
      agentId: job.agentId,
      enabled: (job as any).enabled,
      schedule: job.schedule?.expr || 'n/a',
      timezone: job.schedule?.tz,
      nextRunAt,
      lastRunAt: job.state?.lastRunAtMs ? new Date(job.state.lastRunAtMs).toISOString() : undefined,
      lastStatus: job.state?.lastStatus || job.state?.lastRunStatus,
      lastDurationMs: job.state?.lastDurationMs,
      sessionTarget: job.sessionTarget,
      deliveryMode: job.delivery?.mode,
      timingBucket: getTimingBucket(nextRunAt),
    } as CronJobView;
  });

  const recentRuns = await getCronRuns();
  return jobs.map((job) => ({
    ...job,
    recentRuns: recentRuns.filter((run) => run.jobId === job.id).slice(0, 3),
  }));
}

export async function getCronRuns(jobId?: string): Promise<CronRunView[]> {
  try {
    const args = ['cron', 'runs', '--limit', '50'];
    if (jobId) args.push('--id', jobId);
    const { stdout } = await execFileAsync('openclaw', args, {
      cwd: '/home/jarvis/.openclaw/workspace',
      timeout: 20000,
      maxBuffer: 1024 * 1024,
    });

    return stdout
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .map((entry: any) => ({
        jobId: entry.jobId || entry.id,
        startedAt: entry.startedAt || entry.startedAtIso,
        finishedAt: entry.finishedAt || entry.finishedAtIso,
        status: entry.status,
        durationMs: entry.durationMs,
      }));
  } catch {
    return [];
  }
}

function getTimingBucket(nextRunAt?: string): 'today' | 'tomorrow' | 'later' | 'unknown' {
  if (!nextRunAt) return 'unknown';
  const now = new Date();
  const next = new Date(nextRunAt);
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  const startAfterTomorrow = new Date(startTomorrow);
  startAfterTomorrow.setDate(startAfterTomorrow.getDate() + 1);

  if (next >= startToday && next < startTomorrow) return 'today';
  if (next >= startTomorrow && next < startAfterTomorrow) return 'tomorrow';
  return 'later';
}
