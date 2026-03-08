'use client';

import { useState } from 'react';

export function QuickTaskButton({
  title,
  description,
  relatedMemoryIds,
  relatedCronIds,
  owner = 'Elon',
  label = 'Créer une tâche liée',
  doneLabel = 'Tâche créée',
  className = 'action-button',
}: {
  title: string;
  description?: string;
  relatedMemoryIds?: string[];
  relatedCronIds?: string[];
  owner?: string;
  label?: string;
  doneLabel?: string;
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function create() {
    setState('saving');
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, owner, relatedMemoryIds, relatedCronIds, category: 'suivi' }),
    });
    setState(response.ok ? 'done' : 'error');
    setTimeout(() => setState('idle'), 1800);
  }

  return (
    <button onClick={create} className={className}>
      {state === 'saving' ? 'Création...' : state === 'done' ? doneLabel : state === 'error' ? 'Erreur' : label}
    </button>
  );
}
