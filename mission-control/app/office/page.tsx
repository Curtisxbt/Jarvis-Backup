import office from '@/data/office.json';
import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { OfficeRadar } from '@/components/office/office-radar';
import { getTasks } from '@/lib/tasks/store';
import { getCronJobs } from '@/lib/cron/openclaw';
import { getMemoryDocuments } from '@/lib/memory/scan';
import { findAgentRuntime, formatAge, getRuntimeSignal } from '@/lib/agents/runtime';
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';

export default async function OfficePage({ searchParams }: { searchParams?: Promise<{ filter?: string }> }) {
  const params = (await searchParams) || {};
  const filter = ['all', 'active', 'idle', 'waiting', 'error'].includes(params.filter || '') ? (params.filter as string) : 'all';

  const [tasks, cronJobs, memoryDocs, runtime] = await Promise.all([getTasks(), getCronJobs(), getMemoryDocuments(), getRuntimeSignal()]);

  const seats = (office as Array<{ id: string; agentId: string; label: string; status: string }>).map((seat) => {
    const runtimeAgentId = getRuntimeAgentId(seat.agentId);
    const agentRuntime = findAgentRuntime(runtime, runtimeAgentId);
    const agentTasks = tasks.filter((task) => task.owner.toLowerCase() === seat.agentId && !task.archived);
    const blockedTasks = agentTasks.filter((task) => task.status === 'blocked');
    const inProgressTask = agentTasks.find((task) => task.status === 'in_progress');
    const nextTask = agentTasks.find((task) => task.status === 'backlog');
    const latestMemoryDoc = memoryDocs.find((doc) => doc.agent === seat.agentId);
    const matchingCron = cronJobs.find((job) => (job.agentId || '').toLowerCase() === runtimeAgentId);

    const stateTone = getStateTone({
      gatewayReachable: runtime.gatewayReachable,
      seatStatus: seat.status,
      blockedTasks: blockedTasks.length,
      runtimeIssues: agentRuntime?.issues || [],
      lastActiveAgeMs: agentRuntime?.lastActiveAgeMs,
      sessionsCount: agentRuntime?.sessionsCount || 0,
    });

    const stateLabel = {
      active: 'ACTIVE',
      idle: 'IDLE',
      waiting: 'WAITING',
      error: 'ERROR',
      offline: 'OFFLINE',
    }[stateTone];

    const statusReason = getStatusReason({ stateTone, inProgressTask: inProgressTask?.title, nextTask: nextTask?.title, runtime: agentRuntime, blockedTasks: blockedTasks.length });
    const statusSinceLabel = getStatusSinceLabel({ stateTone, lastActiveAgeMs: agentRuntime?.lastActiveAgeMs, taskUpdatedAt: inProgressTask?.updatedAt, nextRunAt: matchingCron?.nextRunAt });
    const lastActivityLabel = agentRuntime?.lastActiveAgeMs != null ? `${formatAge(agentRuntime.lastActiveAgeMs)} · ${relativeFromAge(agentRuntime.lastActiveAgeMs)}` : 'inconnue';

    return {
      ...seat,
      blockedTasks: blockedTasks.length,
      nextCron: matchingCron?.name,
      latestMemory: latestMemoryDoc?.title,
      lastModel: agentRuntime?.lastModel,
      runtimeHealth: agentRuntime?.healthLabel,
      runtimeIssues: agentRuntime?.issues,
      cronHealth: matchingCron?.healthLabel,
      cronIssues: matchingCron?.healthReasons,
      stateTone,
      stateLabel,
      statusReason,
      statusSinceLabel,
      lastActivityLabel,
      currentTask: stateTone === 'active'
        ? (inProgressTask?.title || 'LLM en cours d’exécution')
        : stateTone === 'waiting'
          ? 'En attente de signal'
          : 'Aucune exécution LLM en cours',
      nextAction: nextTask?.title || matchingCron?.name || 'Aucune prochaine étape claire',
      blocker: agentRuntime?.issues?.[0] || matchingCron?.healthReasons?.[0] || 'Aucun blocage',
    };
  });

  const activity = buildActivityFeed({ seats, tasks, memoryDocs, cronJobs, runtime });
  const activeCount = seats.filter((seat) => seat.stateTone === 'active').length;
  const idleCount = seats.filter((seat) => seat.stateTone === 'idle').length;
  const waitingCount = seats.filter((seat) => seat.stateTone === 'waiting').length;
  const errorCount = seats.filter((seat) => seat.stateTone === 'error' || seat.stateTone === 'offline').length;

  return (
    <>
      <PageHeader
        title="Bureau"
        description="Console d’orchestration orientée statut réel : activité live, idle, attente, erreur, temps écoulé, tâche en cours et journal d’événements."
      />

      <div className="grid cols-4 ops-kpi-grid">
        <Card>
          <div className="muted">Agents actifs</div>
          <div className="kpi">{activeCount}</div>
        </Card>
        <Card>
          <div className="muted">En attente</div>
          <div className="kpi">{waitingCount}</div>
        </Card>
        <Card>
          <div className="muted">Idle</div>
          <div className="kpi">{idleCount}</div>
        </Card>
        <Card>
          <div className="muted">Erreurs / offline</div>
          <div className="kpi">{errorCount}</div>
          <div className="muted">Gateway : <strong style={{ color: 'var(--text)' }}>{runtime.gatewayReachable ? 'OK' : 'DOWN'}</strong></div>
        </Card>
      </div>

      <div style={{ marginTop: 18 }}>
        <OfficeRadar
          seats={seats}
          activity={activity}
          activeCount={activeCount}
          idleCount={idleCount}
          waitingCount={waitingCount}
          errorCount={errorCount}
          filter={filter}
        />
      </div>
    </>
  );
}

function getStateTone({
  gatewayReachable,
  seatStatus,
  blockedTasks,
  runtimeIssues,
  lastActiveAgeMs,
  sessionsCount,
}: {
  gatewayReachable: boolean;
  seatStatus: string;
  blockedTasks: number;
  runtimeIssues: string[];
  lastActiveAgeMs?: number;
  sessionsCount: number;
}): 'active' | 'idle' | 'waiting' | 'error' | 'offline' {
  if (!gatewayReachable) return 'offline';
  if (seatStatus === 'blocked' || runtimeIssues.includes('gateway indisponible')) return 'error';

  const liveExecution = (lastActiveAgeMs ?? Infinity) < 1000 * 15;
  const warmActivity = (lastActiveAgeMs ?? Infinity) < 1000 * 60 * 2;

  if (liveExecution) return 'active';
  if (blockedTasks > 0) return 'error';
  if (seatStatus === 'scheduled' && sessionsCount > 0 && warmActivity) return 'waiting';
  if (sessionsCount === 0 || (lastActiveAgeMs ?? Infinity) >= 1000 * 60 * 2 || seatStatus === 'idle') return 'idle';
  return 'idle';
}

function getStatusReason({
  stateTone,
  inProgressTask,
  nextTask,
  runtime,
  blockedTasks,
}: {
  stateTone: 'active' | 'idle' | 'waiting' | 'error' | 'offline';
  inProgressTask?: string;
  nextTask?: string;
  runtime?: { issues: string[] };
  blockedTasks: number;
}) {
  if (stateTone === 'active') return 'Le runtime LLM tourne réellement en ce moment';
  if (stateTone === 'waiting') return nextTask ? `En attente avant : ${nextTask}` : 'Session présente mais pas en exécution active';
  if (stateTone === 'error') return blockedTasks ? `${blockedTasks} tâche(s) bloquée(s)` : runtime?.issues?.[0] || 'Blocage détecté';
  if (stateTone === 'offline') return 'Gateway ou runtime indisponible';
  return 'Aucune exécution LLM récente';
}

function getStatusSinceLabel({ stateTone, lastActiveAgeMs, taskUpdatedAt, nextRunAt }: { stateTone: string; lastActiveAgeMs?: number; taskUpdatedAt?: string; nextRunAt?: string }) {
  if (stateTone === 'active' && taskUpdatedAt) return relativeFromDate(taskUpdatedAt);
  if ((stateTone === 'idle' || stateTone === 'active' || stateTone === 'error') && lastActiveAgeMs != null) return relativeFromAge(lastActiveAgeMs);
  if (stateTone === 'waiting' && nextRunAt) return `jusqu’à ${relativeFromDate(nextRunAt)}`;
  return 'inconnu';
}

function relativeFromAge(ageMs: number) {
  const target = new Date(Date.now() - ageMs);
  return formatDistanceToNowStrict(target, { addSuffix: true, locale: fr });
}

function relativeFromDate(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true, locale: fr });
}

function buildActivityFeed({ seats, tasks, memoryDocs, cronJobs, runtime }: { seats: any[]; tasks: any[]; memoryDocs: any[]; cronJobs: any[]; runtime: any }) {
  const entries: Array<{ at: string; agent: string; tone: 'active' | 'idle' | 'waiting' | 'error'; label: string; detail: string }> = [];

  for (const seat of seats) {
    const agent = capitalize(seat.agentId);
    const runtimeAgentId = getRuntimeAgentId(seat.agentId);
    const runtimeEntry = runtime?.agents?.find((item: any) => item.agentId === runtimeAgentId);
    const agentTasks = tasks.filter((task) => task.owner.toLowerCase() === seat.agentId && !task.archived);
    const latestTask = [...agentTasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    const latestMemory = memoryDocs.find((doc) => doc.agent === seat.agentId);
    const latestCron = cronJobs.find((job) => (job.agentId || '').toLowerCase() === runtimeAgentId && job.lastRunAt);

    if (runtimeEntry?.lastActiveAgeMs != null) {
      entries.push({
        at: new Date(Date.now() - runtimeEntry.lastActiveAgeMs).toISOString(),
        agent,
        tone: seat.stateTone === 'offline' ? 'error' : seat.stateTone,
        label: seat.stateLabel,
        detail:
          seat.stateTone === 'active'
            ? `LLM actif · modèle ${runtimeEntry.lastModel || 'inconnu'}`
            : seat.stateTone === 'idle'
              ? 'Aucune exécution LLM en cours'
              : seat.stateTone === 'waiting'
                ? 'Session présente, en attente de signal'
                : seat.blocker,
      });
    }

    if (latestTask && latestTask.status === 'blocked') {
      entries.push({
        at: latestTask.updatedAt,
        agent,
        tone: 'error',
        label: 'BLOCKER',
        detail: latestTask.title,
      });
    }

    if (latestCron?.lastRunAt) {
      entries.push({
        at: latestCron.lastRunAt,
        agent,
        tone: latestCron.health === 'danger' ? 'error' : latestCron.health === 'warning' ? 'waiting' : 'active',
        label: 'CRON',
        detail: `${latestCron.name} · ${latestCron.lastStatus || 'statut inconnu'}`,
      });
    }

    if (latestMemory?.updatedAt && runtimeEntry?.lastActiveAgeMs != null && latestMemory.updatedAt > new Date(Date.now() - runtimeEntry.lastActiveAgeMs).toISOString()) {
      entries.push({
        at: latestMemory.updatedAt,
        agent,
        tone: 'active',
        label: 'MEMORY',
        detail: `Mémoire mise à jour · ${latestMemory.title}`,
      });
    }
  }

  const deduped = new Map<string, { at: string; agent: string; tone: 'active' | 'idle' | 'waiting' | 'error'; label: string; detail: string }>();
  for (const entry of entries.sort((a, b) => b.at.localeCompare(a.at))) {
    const key = `${entry.agent}-${entry.label}-${entry.detail}`;
    if (!deduped.has(key)) deduped.set(key, entry);
  }

  return [...deduped.values()]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 12)
    .map((entry) => ({
      time: relativeFromDate(entry.at),
      agent: entry.agent,
      tone: entry.tone,
      label: entry.label,
      detail: entry.detail,
    }));
}

function getRuntimeAgentId(agentId: string) {
  if (agentId === 'elon') return 'main';
  return agentId;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
