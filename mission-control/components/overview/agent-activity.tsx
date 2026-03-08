import { Card } from '@/components/layout/card';
import { AgentProfile } from '@/lib/agents/registry';

export function AgentActivity({ team }: { team: AgentProfile[] }) {
  return (
    <Card>
      <h3>Activité agents</h3>
      <div className="grid">
        {team.map((member) => (
          <div key={member.id} style={rowStyle}>
            <div>
              <strong>{member.name}</strong>
              <div className="muted">{member.role}</div>
            </div>
            <span className="badge">{translateStatus(member.status)}</span>
          </div>
        ))}
      </div>
    </Card>
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

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'center',
  paddingBottom: 12,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};
