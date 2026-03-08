import team from '@/data/team.json';

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  mission: string;
  memoryScope: string;
  status: string;
}

export function getAgentProfiles(): AgentProfile[] {
  return team as AgentProfile[];
}
