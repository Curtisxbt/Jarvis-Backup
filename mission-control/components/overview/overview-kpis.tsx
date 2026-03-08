import { Card } from '@/components/layout/card';

export function OverviewKpis({
  openTasks,
  blockedTasks,
  activeCronJobs,
  cronHealthy,
  recentMemories,
  activeAgents,
}: {
  openTasks: number;
  blockedTasks: number;
  activeCronJobs: number;
  cronHealthy: number;
  recentMemories: number;
  activeAgents: number;
}) {
  const items = [
    { label: 'Tâches ouvertes', value: openTasks },
    { label: 'Tâches bloquées', value: blockedTasks },
    { label: 'Jobs cron actifs', value: activeCronJobs },
    { label: 'Runs sains', value: cronHealthy },
    { label: 'Mémoires récentes', value: recentMemories },
    { label: 'Agents actifs', value: activeAgents },
  ];

  return (
    <div className="grid cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="muted">{item.label}</div>
          <div className="kpi">{item.value}</div>
        </Card>
      ))}
    </div>
  );
}
