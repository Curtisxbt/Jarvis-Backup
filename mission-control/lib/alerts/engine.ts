import { CronJobView } from '@/lib/cron/openclaw';
import { TaskItem } from '@/lib/tasks/types';
import { RuntimeSignal, findAgentRuntime } from '@/lib/agents/runtime';

export type AlertLevel = 'danger' | 'warning' | 'info';

export interface AlertItem {
  level: AlertLevel;
  label: string;
  detail: string;
  href?: string;
  cta?: string;
  score: number;
  category?: string;
}

export function buildAlerts({
  tasks,
  cronJobs,
  todaysElonMemory,
  orphanCronCount,
  runtime,
}: {
  tasks: TaskItem[];
  cronJobs: CronJobView[];
  todaysElonMemory: boolean;
  orphanCronCount: number;
  runtime: RuntimeSignal;
}): AlertItem[] {
  const blockedTasks = tasks.filter((task) => task.status === 'blocked');
  const noisyCrons = cronJobs.filter((job) => job.lastStatus && job.lastStatus !== 'ok');
  const alerts: AlertItem[] = [];
  const mainRuntime = findAgentRuntime(runtime, 'main');

  if (blockedTasks.length) {
    alerts.push({
      level: 'danger',
      label: 'Tâches bloquées',
      detail: `${blockedTasks.length} tâche(s) nécessitent une résolution.`,
      href: '/tasks?status=blocked',
      cta: 'Ouvrir les tâches bloquées',
      score: 100,
      category: 'Exécution',
    });
  }

  if (noisyCrons.length) {
    alerts.push({
      level: 'warning',
      label: 'Cron en attente ou en erreur',
      detail: `${noisyCrons.length} job(s) demandent une vérification.`,
      href: '/calendar',
      cta: 'Vérifier les cron',
      score: 80,
      category: 'Automatisation',
    });
  }

  if (!todaysElonMemory) {
    alerts.push({
      level: 'info',
      label: 'Mémoire quotidienne Elon absente',
      detail: 'Aucune mémoire quotidienne Elon détectée pour aujourd’hui.',
      href: '/memory?agent=elon&kind=daily',
      cta: 'Ouvrir la mémoire Elon',
      score: 40,
      category: 'Mémoire',
    });
  }

  if (orphanCronCount) {
    alerts.push({
      level: 'warning',
      label: 'Cron orphelins',
      detail: `${orphanCronCount} job(s) cron ne sont liés à aucune tâche.`,
      href: '/calendar',
      cta: 'Voir les cron orphelins',
      score: 60,
      category: 'Automatisation',
    });
  }

  if (!runtime.gatewayReachable) {
    alerts.push({
      level: 'danger',
      label: 'Gateway indisponible',
      detail: 'Le gateway OpenClaw ne semble pas joignable depuis Mission Control.',
      score: 120,
      category: 'Infra',
    });
  }

  if (mainRuntime?.recentPercentUsed && mainRuntime.recentPercentUsed >= 95) {
    alerts.push({
      level: 'warning',
      label: 'Contexte Elon presque saturé',
      detail: `La session principale Elon est à ${mainRuntime.recentPercentUsed}% de son contexte.`,
      href: '/team',
      cta: 'Voir l’état agent',
      score: 70,
      category: 'Runtime',
    });
  }

  return alerts.sort((a, b) => b.score - a.score);
}
