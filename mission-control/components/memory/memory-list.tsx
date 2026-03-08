import { MemoryDocument } from '@/lib/memory/types';
import { Card } from '@/components/layout/card';

export function MemoryList({ docs }: { docs: MemoryDocument[] }) {
  return (
    <div className="grid">
      {docs.map((doc) => (
        <Card key={doc.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span className="badge">{doc.agent}</span>
                <span className="badge">{doc.kind}</span>
                {doc.date ? <span className="badge">{doc.date}</span> : null}
              </div>
              <h3 style={{ marginBottom: 8 }}>{doc.title}</h3>
              <div className="muted code" style={{ marginBottom: 12 }}>{doc.relativePath}</div>
            </div>
            <span className="badge">{doc.lineCount} lines</span>
          </div>
          <p className="muted" style={{ marginBottom: 14 }}>{doc.excerpt}</p>
          <details>
            <summary style={{ cursor: 'pointer', color: 'var(--accent)' }}>Open document</summary>
            <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, overflowX: 'auto' }}>{doc.content}</pre>
          </details>
        </Card>
      ))}
    </div>
  );
}
