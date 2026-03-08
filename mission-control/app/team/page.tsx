import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { TeamGrid } from '@/components/team/team-grid';
import { getAgentProfiles } from '@/lib/agents/registry';

export default function TeamPage() {
  const team = getAgentProfiles();

  return (
    <>
      <PageHeader title="Team" description="Roles, responsibilities, and operating posture across the human + agent org." />
      <div className="grid cols-3">
        <Card>
          <div className="muted">Active members</div>
          <div className="kpi">{team.length}</div>
        </Card>
        <Card>
          <div className="muted">Working now</div>
          <div className="kpi">{team.filter((member) => member.status === 'working').length}</div>
        </Card>
        <Card>
          <div className="muted">Scheduled</div>
          <div className="kpi">{team.filter((member) => member.status === 'scheduled').length}</div>
        </Card>
      </div>
      <div style={{ marginTop: 18 }}>
        <TeamGrid team={team} />
      </div>
    </>
  );
}
