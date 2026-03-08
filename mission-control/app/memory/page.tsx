import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { MemoryFilters } from '@/components/memory/memory-filters';
import { MemoryList } from '@/components/memory/memory-list';
import { searchMemory } from '@/lib/memory/search';

export default async function MemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; agent?: string; kind?: string }>;
}) {
  const params = await searchParams;
  const docs = await searchMemory({ query: params.q, agent: params.agent, kind: params.kind });

  const counts = {
    total: docs.length,
    daily: docs.filter((doc) => doc.kind === 'daily').length,
    durable: docs.filter((doc) => doc.kind === 'durable').length,
    handoff: docs.filter((doc) => doc.kind === 'handoff').length,
  };

  return (
    <>
      <PageHeader
        title="Memory"
        description="Search, inspect, and audit operational memory across Elon, Jocko, and shared context."
        actions={<MemoryFilters />}
      />

      <div className="grid cols-3">
        <Card>
          <div className="muted">Visible docs</div>
          <div className="kpi">{counts.total}</div>
        </Card>
        <Card>
          <div className="muted">Daily logs</div>
          <div className="kpi">{counts.daily}</div>
        </Card>
        <Card>
          <div className="muted">Durable / handoff</div>
          <div className="kpi">{counts.durable + counts.handoff}</div>
        </Card>
      </div>

      <div style={{ marginTop: 18 }}>
        <MemoryList docs={docs} />
      </div>
    </>
  );
}
