'use client';

import { useState } from 'react';

export function RunCronButton({ jobId }: { jobId: string }) {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  async function runNow() {
    setState('running');
    const response = await fetch('/api/cron/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    });
    setState(response.ok ? 'done' : 'error');
    setTimeout(() => setState('idle'), 2200);
  }

  return (
    <button onClick={runNow} className="action-button secondary-button">
      {state === 'running' ? 'Lancement...' : state === 'done' ? 'Lancé' : state === 'error' ? 'Erreur' : 'Run now'}
    </button>
  );
}
