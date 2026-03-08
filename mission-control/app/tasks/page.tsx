import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { TaskBoard } from '@/components/tasks/task-board';
import { getTasks } from '@/lib/tasks/store';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <>
      <PageHeader title="Tasks" description="Execution board for Denis, Elon, Jocko, and future subagents." />
      <div className="grid cols-3">
        <Card>
          <div className="muted">Open tasks</div>
          <div className="kpi">{tasks.filter((task) => task.status !== 'done').length}</div>
        </Card>
        <Card>
          <div className="muted">Blocked</div>
          <div className="kpi">{tasks.filter((task) => task.status === 'blocked').length}</div>
        </Card>
        <Card>
          <div className="muted">Completed</div>
          <div className="kpi">{tasks.filter((task) => task.status === 'done').length}</div>
        </Card>
      </div>
      <div style={{ marginTop: 18 }}>
        <TaskBoard initialTasks={tasks} />
      </div>
    </>
  );
}
