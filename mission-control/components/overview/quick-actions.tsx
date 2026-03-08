import Link from 'next/link';
import { Card } from '@/components/layout/card';
import { QuickTaskButton } from '@/components/actions/quick-task-button';

const actions = [
  { href: '/tasks?status=blocked', label: 'Traiter les blocages', description: 'Ouvrir directement les tâches bloquées et débloquer l’exécution.' },
  { href: '/calendar', label: 'Intervenir sur les cron', description: 'Vérifier les jobs, relancer, désactiver ou créer un suivi.' },
  { href: '/team', label: 'Inspecter les agents', description: 'Contrôler sessions, contexte, activité et signaux faibles.' },
  { href: '/memory', label: 'Ouvrir la mémoire', description: 'Consulter les journaux quotidiens et les mémoires durables.' },
];

export function QuickActions() {
  return (
    <Card>
      <h3>Actions rapides</h3>
      <div className="grid" style={{ gap: 12 }}>
        {actions.map((action) => (
          <Link key={action.href} href={action.href} style={linkStyle}>
            <strong>{action.label}</strong>
            <div className="muted">{action.description}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="muted" style={{ marginBottom: 8 }}>Interventions immédiates</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <QuickTaskButton
            title="Déblocage prioritaire"
            description="Créer une tâche de déblocage rapide depuis Mission Control."
            label="Créer une tâche de déblocage"
          />
          <QuickTaskButton
            title="Revue état système"
            description="Créer une tâche de revue rapide des signaux critiques et alertes actives."
            label="Créer une tâche revue système"
          />
        </div>
      </div>
    </Card>
  );
}

const linkStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 14,
  background: 'rgba(255,255,255,0.03)',
};
