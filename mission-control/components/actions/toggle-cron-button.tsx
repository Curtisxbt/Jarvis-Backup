'use client';

import { useState } from 'react';

export function ToggleCronButton({ jobId, enabled }: { jobId: string; enabled: boolean }) {
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [current, setCurrent] = useState(enabled);

  async function toggle() {
    setState('saving');
    const next = !current;
    const response = await fetch('/api/cron/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, enabled: next }),
    });
    if (response.ok) {
      setCurrent(next);
      setState('done');
    } else {
      setState('error');
    }
    setTimeout(() => setState('idle'), 2200);
  }

  const label = state === 'saving' ? 'Maj...' : state === 'error' ? 'Erreur' : current ? 'Désactiver' : 'Activer';

  return (
    <button onClick={toggle} className="action-button secondary-button">
      {label}
    </button>
  );
}
