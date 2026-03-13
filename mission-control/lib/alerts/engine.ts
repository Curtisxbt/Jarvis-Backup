import { CronJobView } from '@/lib/cron/openclaw';
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
  cronJobs,
  todaysElonMemory,
  runtime,
}: {
  cronJobs: CronJobView[];
  todaysElonMemory: boolean;
  runtime: RuntimeSignal;
}): AlertItem[] {
  const noisyCrons = cronJobs.filter((job) => job.health !== 'ok');
  const alerts: AlertItem[] = [];
  const mainRuntime = findAgentRuntime(runtime, 'main');

  if (noisyCrons.length) {
    const criticalCrons = noisyCrons.filter((job) => job.health === 'danger').length;
    alerts.push({
      level: criticalCrons ? 'danger' : 'warning',
      label: criticalCrons ? 'Cron critiques détectés' : 'Cron en attention',
      detail: criticalCrons
        ? `${criticalCrons} job(s) cron sont en état critique.`
        : `${noisyCrons.length} job(s) cron demandent une vérification.`,
      href: '/calendar',
      cta: 'Vérifier les cron',
      score: criticalCrons ? 95 : 80,
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
