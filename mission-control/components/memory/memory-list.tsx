import { MemoryDocument } from '@/lib/memory/types';
import { Card } from '@/components/layout/card';
import { LinkedEntities } from '@/components/shared/linked-entities';
import { QuickTaskButton } from '@/components/actions/quick-task-button';

type LinkedItem = { id: string; label: string; meta: string; href?: string };

export function MemoryList({
  docs,
  linkedTasks,
  focusDocId,
}: {
  docs: MemoryDocument[];
  linkedTasks: Record<string, LinkedItem[]>;
  focusDocId?: string;
}) {
  return (
    <div className="grid">
      {docs.map((doc) => (
        <Card key={doc.id}>
          <div className={focusDocId === doc.id ? 'focus-card' : undefined}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className="badge">{translateAgent(doc.agent)}</span>
                  <span className="badge">{translateKind(doc.kind)}</span>
                  {doc.date ? <span className="badge">{doc.date}</span> : null}
                </div>
                <h3 style={{ marginBottom: 8 }}>{doc.title}</h3>
                <div className="muted code" style={{ marginBottom: 12 }}>{doc.relativePath}</div>
              </div>
              <span className="badge">{doc.lineCount} lignes</span>
            </div>
            <p className="muted" style={{ marginBottom: 14 }}>{doc.excerpt}</p>
            <LinkedEntities title="Tâches liées" items={linkedTasks[doc.id] || []} />
            <div style={{ marginTop: 12 }}>
              <QuickTaskButton title={`Suivi mémoire · ${doc.title}`} description={doc.excerpt} relatedMemoryIds={[doc.id]} />
            </div>
            <details>
              <summary style={{ cursor: 'pointer', color: 'var(--accent)' }}>Ouvrir le document</summary>
              <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, overflowX: 'auto' }}>{doc.content}</pre>
            </details>
          </div>
        </Card>
      ))}
    </div>
  );
}

function translateAgent(agent: string) {
  if (agent === 'shared') return 'Partagé';
  return agent.charAt(0).toUpperCase() + agent.slice(1);
}

function translateKind(kind: string) {
  if (kind === 'daily') return 'Quotidienne';
  if (kind === 'durable') return 'Durable';
  if (kind === 'handoff') return 'Passation';
  return kind;
}
