import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/layout/card';
import { TaskHub } from '@/components/tasks/task-hub';
import { getTasks } from '@/lib/tasks/store';
import { getLinkableResources } from '@/lib/links/resolve';

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string; status?: string; q?: string; taskId?: string }>;
}) {
  const params = await searchParams;
  const [tasks, resources] = await Promise.all([getTasks(), getLinkableResources()]);

  return (
    <>
      <PageHeader title="Tâches" description="Tableau d’exécution pour Denis, Elon, Jocko et les futurs sous-agents." />
      <div className="grid cols-3">
        <Card>
          <div className="muted">Tâches ouvertes</div>
          <div className="kpi">{tasks.filter((task) => task.status !== 'done').length}</div>
        </Card>
        <Card>
          <div className="muted">Bloquées</div>
          <div className="kpi">{tasks.filter((task) => task.status === 'blocked').length}</div>
        </Card>
        <Card>
          <div className="muted">Terminées</div>
          <div className="kpi">{tasks.filter((task) => task.status === 'done').length}</div>
        </Card>
      </div>
      <div style={{ marginTop: 18 }}>
        <TaskHub
          initialTasks={tasks}
          memoryOptions={resources.memoryOptions}
          cronOptions={resources.cronOptions}
          initialFilters={{
            query: params.q || '',
            owner: params.owner || '',
            status: params.status || '',
            priority: '',
            category: '',
          }}
          focusTaskId={params.taskId}
        />
      </div>
    </>
  );
}
