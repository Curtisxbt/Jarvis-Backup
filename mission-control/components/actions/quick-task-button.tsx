'use client';

import { useState } from 'react';

export function QuickTaskButton({
  title,
  description,
  relatedMemoryIds,
  relatedCronIds,
  owner = 'Elon',
}: {
  title: string;
  description?: string;
  relatedMemoryIds?: string[];
  relatedCronIds?: string[];
  owner?: string;
}) {
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');

  async function create() {
    setState('saving');
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, owner, relatedMemoryIds, relatedCronIds, category: 'suivi' }),
    });
    setState('done');
    setTimeout(() => setState('idle'), 1800);
  }

  return (
    <button onClick={create} className="action-button">
      {state === 'saving' ? 'Création...' : state === 'done' ? 'Tâche créée' : 'Créer une tâche liée'}
    </button>
  );
}
