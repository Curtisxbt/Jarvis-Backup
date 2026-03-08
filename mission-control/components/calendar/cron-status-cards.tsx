import { Card } from '@/components/layout/card';

export function CronStatusCards({
  total,
  healthy,
  today,
  tomorrow,
  later,
  unknown,
}: {
  total: number;
  healthy: number;
  today: number;
  tomorrow: number;
  later: number;
  unknown: number;
}) {
  const items = [
    { label: 'Jobs actifs', value: total },
    { label: 'Derniers runs sains', value: healthy },
    { label: 'Aujourd’hui', value: today },
    { label: 'Demain', value: tomorrow },
    { label: 'Plus tard', value: later + unknown },
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
