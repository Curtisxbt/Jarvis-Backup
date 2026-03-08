import Link from 'next/link';
import { Card } from '@/components/layout/card';

const actions = [
  { href: '/tasks', label: 'Ouvrir les tâches', description: 'Piloter le backlog et les tâches en cours.' },
  { href: '/calendar', label: 'Ouvrir le calendrier', description: 'Vérifier les cron, les horaires et les prochains runs.' },
  { href: '/memory', label: 'Ouvrir la mémoire', description: 'Consulter les journaux quotidiens et les mémoires durables.' },
];

export function QuickActions() {
  return (
    <Card>
      <h3>Actions rapides</h3>
      <div className="grid">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} style={linkStyle}>
            <strong>{action.label}</strong>
            <div className="muted">{action.description}</div>
          </Link>
        ))}
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
