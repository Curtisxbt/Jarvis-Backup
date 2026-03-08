import Link from 'next/link';
import { Card } from '@/components/layout/card';

type AlertItem = {
  level: 'warning' | 'danger' | 'info';
  label: string;
  detail: string;
  href?: string;
  cta?: string;
  category?: string;
};

export function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ marginBottom: 0 }}>Alertes</h3>
        <span className="badge">{alerts.length} active(s)</span>
      </div>
      <div className="grid">
        {alerts.length === 0 ? <div className="muted">Aucune alerte critique détectée.</div> : null}
        {alerts.map((alert, index) => (
          <div key={`${alert.label}-${index}`} className={`alert-row alert-${alert.level}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <div>
                {alert.category ? <div className="muted code" style={{ marginBottom: 4 }}>{alert.category}</div> : null}
                <strong>{alert.label}</strong>
                <div className="muted" style={{ marginTop: 4 }}>{alert.detail}</div>
              </div>
              <span className="badge">{translateLevel(alert.level)}</span>
            </div>
            {alert.href ? (
              <div style={{ marginTop: 10 }}>
                <Link href={alert.href} className="alert-link">{alert.cta || 'Ouvrir'}</Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

function translateLevel(level: string) {
  if (level === 'danger') return 'critique';
  if (level === 'warning') return 'attention';
  return 'info';
}
