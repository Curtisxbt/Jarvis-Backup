import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';

const modules = [
  {
    title: 'Tasks',
    description: 'Pilot every task across Denis, Elon, Jocko, and future subagents.',
  },
  {
    title: 'Calendar',
    description: 'View cron jobs, planned runs, and operational cadence in one place.',
  },
  {
    title: 'Memory',
    description: 'Search and inspect daily logs and durable memories without digging through markdown manually.',
  },
  {
    title: 'Team',
    description: 'See agent roles, responsibilities, and current operating posture.',
  },
  {
    title: 'Office',
    description: 'Visual live-status layer for who is idle, working, scheduled, or blocked.',
  },
];

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Mission Control"
        description="One operating surface for execution, memory, automation, and agent visibility."
      />
      <div className="grid cols-3">
        <Card>
          <div className="muted">System status</div>
          <div className="kpi">Bootstrapped</div>
          <p className="muted">Foundation is live. Feature modules plug into this shell next.</p>
        </Card>
        <Card>
          <div className="muted">Primary focus</div>
          <div className="kpi">Operational clarity</div>
          <p className="muted">The app is designed to reduce hidden state: tasks, cron, memory, and agents become visible.</p>
        </Card>
        <Card>
          <div className="muted">Build mode</div>
          <div className="kpi">Local-first</div>
          <p className="muted">The first version prioritizes reliability, file access, and speed over flashy abstractions.</p>
        </Card>
      </div>
      <div className="grid cols-2" style={{ marginTop: 18 }}>
        {modules.map((module) => (
          <Card key={module.title}>
            <h3>{module.title}</h3>
            <p className="muted">{module.description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
