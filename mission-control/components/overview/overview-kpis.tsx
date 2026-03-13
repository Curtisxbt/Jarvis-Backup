import { Card } from '@/components/layout/card';

export function OverviewKpis({
  activeCronJobs,
  cronHealthy,
  recentMemories,
  activeAgents,
}: {
  activeCronJobs: number;
  cronHealthy: number;
  recentMemories: number;
  activeAgents: number;
}) {
  const items = [
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
