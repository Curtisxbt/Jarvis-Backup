'use client';

import { useMemo, useState } from 'react';
import { CronJobView } from '@/lib/cron/openclaw';
import { CronAgenda } from '@/components/calendar/cron-agenda';
import { CronFilters } from '@/components/calendar/cron-filters';
import { CronTable } from '@/components/calendar/cron-table';

type LinkedItem = { id: string; label: string; meta: string; href?: string };

export function CalendarHub({
  jobs,
  linkedTasks,
  focusJobId,
}: {
  jobs: CronJobView[];
  linkedTasks: Record<string, LinkedItem[]>;
  focusJobId?: string;
}) {
  const [filters, setFilters] = useState({ agent: '', status: '', bucket: '' });
  const [view, setView] = useState<'agenda' | 'table'>('agenda');

  const agents = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.agentId || 'défaut'))).sort((a, b) => a.localeCompare(b)),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const agentOk = filters.agent ? (job.agentId || 'défaut') === filters.agent : true;
      const status = job.lastStatus === 'ok' ? 'ok' : job.lastStatus === 'error' || job.lastStatus === 'failed' ? 'error' : 'pending';
      const statusOk = filters.status ? status === filters.status : true;
      const bucketOk = filters.bucket ? job.timingBucket === filters.bucket : true;
      return agentOk && statusOk && bucketOk;
    });
  }, [filters, jobs]);

  return (
    <div className="grid">
      <div className="card toolbar-card">
        <CronFilters filters={filters} agents={agents} onChange={setFilters} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('agenda')} style={view === 'agenda' ? activeButtonStyle : ghostButtonStyle}>Vue agenda</button>
          <button onClick={() => setView('table')} style={view === 'table' ? activeButtonStyle : ghostButtonStyle}>Vue table</button>
        </div>
      </div>
      {view === 'agenda' ? (
        <CronAgenda jobs={filteredJobs} linkedTasks={linkedTasks} focusJobId={focusJobId} />
      ) : (
        <CronTable jobs={filteredJobs} linkedTasks={linkedTasks} focusJobId={focusJobId} />
      )}
    </div>
  );
}

const activeButtonStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
  color: 'white',
  borderRadius: 12,
  padding: '8px 12px',
  cursor: 'pointer',
  fontWeight: 700,
};

const ghostButtonStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  borderRadius: 12,
  padding: '8px 12px',
  cursor: 'pointer',
};
