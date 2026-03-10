import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CRON_CACHE_TTL_MS = 10_000;
let cronJobsCache: { key: string; expiresAt: number; value: CronJobView[] } | null = null;

export interface CronRunView {
  jobId: string;
  startedAt?: string;
  finishedAt?: string;
  status?: string;
  durationMs?: number;
}

export type HealthLevel = 'ok' | 'warning' | 'danger';
export type TimingBucket = 'yesterday' | 'today' | 'tomorrow' | 'later' | 'unknown';

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
  failureCount: number;
  successCount: number;
  health: HealthLevel;
  healthLabel: string;
  healthReasons: string[];
  sessionTarget?: string;
  deliveryMode?: string;
  source: 'openclaw' | 'linux';
  timingBucket: TimingBucket;
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

export async function getCronJobs(options?: { includeRuns?: boolean; includeLinuxUserCrons?: boolean }): Promise<CronJobView[]> {
  const cacheKey = `${options?.includeRuns ? 'with-runs' : 'base'}:${options?.includeLinuxUserCrons === false ? 'no-linux' : 'with-linux'}`;
  const now = Date.now();
  if (cronJobsCache && cronJobsCache.key === cacheKey && cronJobsCache.expiresAt > now) {
    return cronJobsCache.value;
  }

  const { stdout } = await execFileAsync('openclaw', ['cron', 'list', '--json'], {
    cwd: '/home/jarvis/.openclaw/workspace',
    timeout: 20000,
    maxBuffer: 1024 * 1024,
  });

  const parsed = JSON.parse(stdout) as CronListResponse;
  const jobs = (parsed.jobs || []).map((job) => {
    const nextRunAt = job.state?.nextRunAtMs ? new Date(job.state.nextRunAtMs).toISOString() : undefined;
    const lastStatus = job.state?.lastStatus || job.state?.lastRunStatus;
    const failureCount = isFailure(lastStatus) ? 1 : 0;
    const successCount = isSuccess(lastStatus) ? 1 : 0;
    const health = getCronHealth({
      enabled: (job as any).enabled !== false,
      lastStatus,
      lastDurationMs: job.state?.lastDurationMs,
      failureCount,
      nextRunAt,
    });

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
      lastStatus,
      lastDurationMs: job.state?.lastDurationMs,
      recentRuns: [],
      failureCount,
      successCount,
      health: health.level,
      healthLabel: health.label,
      healthReasons: health.reasons,
      sessionTarget: job.sessionTarget,
      deliveryMode: job.delivery?.mode,
      source: 'openclaw',
      timingBucket: getDisplayBucket(nextRunAt, job.state?.lastRunAtMs ? new Date(job.state.lastRunAtMs).toISOString() : undefined),
    } as CronJobView;
  });

  const jobsWithLinux = options?.includeLinuxUserCrons === false ? jobs : [...jobs, ...(await getLinuxUserCronJobs())];

  if (!options?.includeRuns) {
    cronJobsCache = {
      key: cacheKey,
      expiresAt: now + CRON_CACHE_TTL_MS,
      value: jobsWithLinux,
    };
    return jobsWithLinux;
  }

  const recentRuns = await getCronRuns();
  const hydratedOpenclawJobs = jobs.map((job) => {
    const jobRuns = recentRuns.filter((run) => run.jobId === job.id).slice(0, 5);
    const failureCount = jobRuns.filter((run) => isFailure(run.status)).length;
    const successCount = jobRuns.filter((run) => isSuccess(run.status)).length;
    const health = getCronHealth({ enabled: job.enabled !== false, lastStatus: job.lastStatus, lastDurationMs: job.lastDurationMs, failureCount, nextRunAt: job.nextRunAt });
    return {
      ...job,
      recentRuns: jobRuns,
      failureCount,
      successCount,
      health: health.level,
      healthLabel: health.label,
      healthReasons: health.reasons,
    };
  });

  const hydratedJobs = options?.includeLinuxUserCrons === false
    ? hydratedOpenclawJobs
    : [...hydratedOpenclawJobs, ...(await getLinuxUserCronJobs())];

  cronJobsCache = {
    key: cacheKey,
    expiresAt: now + CRON_CACHE_TTL_MS,
    value: hydratedJobs,
  };

  return hydratedJobs;
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

function getDisplayBucket(nextRunAt?: string, lastRunAt?: string): TimingBucket {
  if (lastRunAt && isYesterday(lastRunAt)) return 'yesterday';
  return getTimingBucket(nextRunAt);
}

function getTimingBucket(nextRunAt?: string): TimingBucket {
  if (!nextRunAt) return 'unknown';
  const now = new Date();
  const next = new Date(nextRunAt);
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  const startAfterTomorrow = new Date(startTomorrow);
  startAfterTomorrow.setDate(startAfterTomorrow.getDate() + 1);
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);

  if (next >= startYesterday && next < startToday) return 'yesterday';
  if (next >= startToday && next < startTomorrow) return 'today';
  if (next >= startTomorrow && next < startAfterTomorrow) return 'tomorrow';
  return 'later';
}

function isFailure(status?: string) {
  return status === 'error' || status === 'failed';
}

function isSuccess(status?: string) {
  return status === 'ok' || status === 'success';
}

function isYesterday(value: string) {
  const date = new Date(value);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);
  return date >= startYesterday && date < startToday;
}

async function getLinuxUserCronJobs(): Promise<CronJobView[]> {
  try {
    const [{ stdout: cronStdout }, linuxCronRuns] = await Promise.all([
      execFileAsync('crontab', ['-l'], { cwd: '/home/jarvis/.openclaw/workspace', timeout: 10000, maxBuffer: 1024 * 1024 }),
      getLinuxCronRuns(),
    ]);

    const lines = cronStdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    const jobs = lines
      .map((line, index) => parseLinuxCronLine(line, index, linuxCronRuns))
      .filter((job): job is CronJobView => Boolean(job));

    return jobs;
  } catch {
    return [];
  }
}

function parseLinuxCronLine(line: string, index: number, runs: Record<string, CronRunView | undefined>): CronJobView | null {
  const parts = line.split(/\s+/);
  if (parts.length < 6) return null;
  const [minute, hour, dom, month, dow, ...commandParts] = parts;
  const command = commandParts.join(' ');
  if (!command.includes('/home/jarvis/')) return null;
  if (command.includes('merge_session_memory.py')) return null;

  const nextRunAt = getNextRunFromSimpleCron(minute, hour, dom, month, dow);
  const runKey = command.includes('backup_cerveau.sh') ? 'backup_cerveau.sh' : command;
  const run = runs[runKey];
  const lastStatus = run?.status || 'pending';
  const failureCount = isFailure(lastStatus) ? 1 : 0;
  const successCount = isSuccess(lastStatus) ? 1 : 0;
  const health = getCronHealth({ enabled: true, lastStatus, lastDurationMs: run?.durationMs, failureCount, nextRunAt });

  return {
    id: `linux-${index}`,
    name: command.includes('backup_cerveau.sh') ? 'backup-cerveau' : `cron-linux-${index}`,
    description: command,
    agentId: 'linux',
    enabled: true,
    schedule: `${minute} ${hour} ${dom} ${month} ${dow}`,
    timezone: 'Europe/Paris',
    nextRunAt,
    lastRunAt: run?.startedAt,
    lastStatus,
    lastDurationMs: run?.durationMs,
    recentRuns: run ? [run] : [],
    failureCount,
    successCount,
    health: health.level,
    healthLabel: health.label,
    healthReasons: health.reasons,
    source: 'linux',
    timingBucket: getDisplayBucket(nextRunAt, run?.startedAt),
  };
}

function getNextRunFromSimpleCron(minute: string, hour: string, dom: string, month: string, dow: string) {
  if (![minute, hour].every((v) => /^\d+$/.test(v)) || dom !== '*' || month !== '*' || dow !== '*') return undefined;
  const now = new Date();
  const next = new Date(now);
  next.setSeconds(0, 0);
  next.setHours(Number(hour), Number(minute), 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.toISOString();
}

async function getLinuxCronRuns(): Promise<Record<string, CronRunView | undefined>> {
  try {
    const { stdout } = await execFileAsync('journalctl', ['--since', '2 days ago', '-o', 'short-iso', '--no-pager'], {
      cwd: '/home/jarvis/.openclaw/workspace',
      timeout: 15000,
      maxBuffer: 4 * 1024 * 1024,
    });

    const lines = stdout.split('\n');
    const backupLines = lines.filter((line) => line.includes('backup_cerveau.sh'));
    const latest = backupLines[backupLines.length - 1];
    if (!latest) return {};

    const match = latest.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    const startedAt = match ? new Date(match[1]).toISOString() : undefined;
    return {
      'backup_cerveau.sh': {
        jobId: 'backup_cerveau.sh',
        startedAt,
        status: 'ok',
      },
    };
  } catch {
    return {};
  }
}

function getCronHealth({
  enabled,
  lastStatus,
  lastDurationMs,
  failureCount,
  nextRunAt,
}: {
  enabled: boolean;
  lastStatus?: string;
  lastDurationMs?: number;
  failureCount: number;
  nextRunAt?: string;
}): { level: HealthLevel; label: string; reasons: string[] } {
  const reasons: string[] = [];

  if (!enabled) reasons.push('job désactivé');
  if (isFailure(lastStatus)) reasons.push('dernier run en échec');
  if (failureCount >= 2) reasons.push('échecs récents répétés');
  if ((lastDurationMs ?? 0) >= 1000 * 60 * 5) reasons.push('durée anormalement longue');
  if (!nextRunAt) reasons.push('prochain run inconnu');

  if (isFailure(lastStatus) || failureCount >= 2) {
    return { level: 'danger', label: 'critique', reasons };
  }

  if (!enabled || (lastDurationMs ?? 0) >= 1000 * 60 * 5 || !nextRunAt) {
    return { level: 'warning', label: 'attention', reasons };
  }

  return { level: 'ok', label: 'ok', reasons };
}
