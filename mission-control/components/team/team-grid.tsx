import { Card } from '@/components/layout/card';
import { AgentProfile } from '@/lib/agents/registry';

export function TeamGrid({ team }: { team: AgentProfile[] }) {
  return (
    <div className="grid cols-3">
      {team.map((member) => (
        <Card key={member.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h3>{member.name}</h3>
            <span className="badge">{translateStatus(member.status)}</span>
          </div>
          <div className="muted" style={{ marginBottom: 10 }}>{member.role}</div>
          <p>{member.mission}</p>
          <div className="muted code">{member.memoryScope}</div>
        </Card>
      ))}
    </div>
  );
}

function translateStatus(status: string) {
  if (status === 'working') return 'en activité';
  if (status === 'scheduled') return 'planifié';
  if (status === 'online') return 'en ligne';
  if (status === 'blocked') return 'bloqué';
  if (status === 'idle') return 'inactif';
  return status;
}
