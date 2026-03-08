export type MemoryAgent = 'elon' | 'jocko' | 'shared';
export type MemoryKind = 'daily' | 'durable' | 'handoff';

export interface MemoryDocument {
  id: string;
  agent: MemoryAgent;
  kind: MemoryKind;
  title: string;
  path: string;
  relativePath: string;
  date?: string;
  content: string;
  excerpt: string;
  lineCount: number;
  updatedAt: string;
}
