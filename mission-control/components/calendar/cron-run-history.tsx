import { CronRunView } from '@/lib/cron/openclaw';

export function CronRunHistory({ runs }: { runs?: CronRunView[] }) {
  if (!runs || !runs.length) {
    return <div className="muted code" style={{ marginTop: 6 }}>Aucun historique récent.</div>;
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div className="muted" style={{ marginBottom: 6 }}>Historique récent</div>
      <div className="grid" style={{ gap: 6 }}>
        {runs.map((run, index) => (
          <div key={`${run.jobId}-${run.startedAt}-${index}`} className="muted code">
            {run.startedAt ? new Date(run.startedAt).toLocaleString('fr-FR') : 'Date inconnue'} · {translateStatus(run.status)}{run.durationMs ? ` · ${formatDuration(run.durationMs)}` : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

function translateStatus(status?: string) {
  if (status === 'ok' || status === 'success') return 'OK';
  if (status === 'error' || status === 'failed') return 'Erreur';
  return 'En attente';
}

function formatDuration(durationMs: number) {
  if (durationMs < 1000) return `${durationMs} ms`;
  const seconds = Math.round(durationMs / 1000);
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min ${remainingSeconds}s`;
}
