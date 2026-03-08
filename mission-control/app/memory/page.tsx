import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { MemoryFilters } from '@/components/memory/memory-filters';
import { MemoryList } from '@/components/memory/memory-list';
import { searchMemory } from '@/lib/memory/search';
import { getTaskRelations } from '@/lib/links/resolve';

export default async function MemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; agent?: string; kind?: string; docId?: string }>;
}) {
  const params = await searchParams;
  const [docs, relations] = await Promise.all([
    searchMemory({ query: params.q, agent: params.agent, kind: params.kind }),
    getTaskRelations(),
  ]);

  const counts = {
    total: docs.length,
    daily: docs.filter((doc) => doc.kind === 'daily').length,
    durable: docs.filter((doc) => doc.kind === 'durable').length,
    handoff: docs.filter((doc) => doc.kind === 'handoff').length,
  };

  const linkedTasks = Object.fromEntries(
    docs.map((doc) => [
      doc.id,
      (relations.tasksByMemoryId.get(doc.id) || []).map((task) => ({
        id: task.id,
        label: task.title,
        meta: `${task.owner} · ${task.category}`,
        href: `/tasks?taskId=${encodeURIComponent(task.id)}`,
      })),
    ]),
  );

  return (
    <>
      <PageHeader
        title="Mémoire"
        description="Recherche, inspection et audit de la mémoire opérationnelle d’Elon, Jocko et du contexte partagé."
        actions={<MemoryFilters />}
      />

      <div className="grid cols-3">
        <Card>
          <div className="muted">Documents visibles</div>
          <div className="kpi">{counts.total}</div>
        </Card>
        <Card>
          <div className="muted">Journaux quotidiens</div>
          <div className="kpi">{counts.daily}</div>
        </Card>
        <Card>
          <div className="muted">Durable / passation</div>
          <div className="kpi">{counts.durable + counts.handoff}</div>
        </Card>
      </div>

      <div style={{ marginTop: 18 }}>
        <MemoryList docs={docs} linkedTasks={linkedTasks} focusDocId={params.docId} />
      </div>
    </>
  );
}
