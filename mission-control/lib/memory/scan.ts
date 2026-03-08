import fs from 'node:fs/promises';
import path from 'node:path';
import { MemoryAgent, MemoryDocument, MemoryKind } from '@/lib/memory/types';

const WORKSPACE_ROOT = '/home/jarvis/.openclaw/workspace';
const AGENTS_ROOT = path.join(WORKSPACE_ROOT, 'agents');

const targets: Array<{ agent: MemoryAgent; file: string; kind: MemoryKind }> = [
  { agent: 'elon', file: 'MEMORY.md', kind: 'durable' },
  { agent: 'jocko', file: 'MEMORY.md', kind: 'durable' },
  { agent: 'shared', file: 'MEMORY.md', kind: 'durable' },
];

function inferKind(filename: string): MemoryKind {
  if (filename === 'HANDOFF.md') return 'handoff';
  if (filename === 'MEMORY.md') return 'durable';
  return 'daily';
}

function titleFromContent(filename: string, content: string): string {
  const heading = content.split('\n').find((line) => line.startsWith('# '));
  return heading?.replace(/^#\s+/, '').trim() || filename.replace(/\.md$/, '');
}

export async function getMemoryDocuments(): Promise<MemoryDocument[]> {
  const docs: MemoryDocument[] = [];

  for (const target of targets) {
    const fullPath = path.join(AGENTS_ROOT, target.agent, target.file);
    const content = await fs.readFile(fullPath, 'utf8');
    docs.push(await toDocument(target.agent, target.kind, fullPath, content));
  }

  for (const agent of ['elon', 'jocko', 'shared'] as const) {
    const memoryDir = path.join(AGENTS_ROOT, agent, 'memory');
    let entries: string[] = [];
    try {
      entries = await fs.readdir(memoryDir);
    } catch {
      continue;
    }

    for (const entry of entries.filter((name) => name.endsWith('.md')).sort()) {
      const fullPath = path.join(memoryDir, entry);
      const content = await fs.readFile(fullPath, 'utf8');
      docs.push(await toDocument(agent, inferKind(entry), fullPath, content));
    }
  }

  return docs.sort((a, b) => {
    const left = a.date || a.updatedAt;
    const right = b.date || b.updatedAt;
    return right.localeCompare(left);
  });
}

async function toDocument(agent: MemoryAgent, kind: MemoryKind, fullPath: string, content: string): Promise<MemoryDocument> {
  const relativePath = path.relative(WORKSPACE_ROOT, fullPath);
  const stats = await fs.stat(fullPath);
  const filename = path.basename(fullPath);
  const excerpt = content.replace(/\s+/g, ' ').trim().slice(0, 220);
  const date = /^\d{4}-\d{2}-\d{2}\.md$/.test(filename) ? filename.replace(/\.md$/, '') : undefined;

  return {
    id: relativePath,
    agent,
    kind,
    title: titleFromContent(filename, content),
    path: fullPath,
    relativePath,
    date,
    content,
    excerpt,
    lineCount: content.split('\n').length,
    updatedAt: stats.mtime.toISOString(),
  };
}
