import Link from 'next/link';

type OfficeRadarItem = {
  id: string;
  label: string;
  agentId: string;
  status: string;
  stateLabel: string;
  stateTone: 'active' | 'idle' | 'waiting' | 'error' | 'offline';
  statusReason: string;
  statusSinceLabel: string;
  lastActivityLabel: string;
  currentTask: string;
  nextAction: string;
  blocker: string;
  blockedTasks: number;
  nextCron?: string;
  latestMemory?: string;
  lastModel?: string;
  runtimeHealth?: string;
  runtimeIssues?: string[];
  cronHealth?: string;
  cronIssues?: string[];
};

type ActivityItem = {
  time: string;
  agent: string;
  tone: 'active' | 'idle' | 'waiting' | 'error';
  label: string;
  detail: string;
};

type OfficeRadarProps = {
  seats: OfficeRadarItem[];
  activity: ActivityItem[];
  activeCount: number;
  idleCount: number;
  waitingCount: number;
  errorCount: number;
  filter: string;
};

const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'active', label: 'Actifs' },
  { key: 'idle', label: 'Idle' },
  { key: 'waiting', label: 'En attente' },
  { key: 'error', label: 'Erreurs' },
] as const;

export function OfficeRadar({ seats, activity, activeCount, idleCount, waitingCount, errorCount, filter }: OfficeRadarProps) {
  const visibleSeats = seats.filter((seat) => filter === 'all' || seat.stateTone === filter);

  return (
    <div className="ops-page">
      <section className="ops-hero card">
        <div>
          <div className="ops-eyebrow">Radar opérationnel</div>
          <h2 className="ops-title">Qui bosse, qui attend, qui est bloqué.</h2>
          <p className="ops-subtitle">Lecture instantanée de l’état réel des agents, avec temps, tâche actuelle, prochaine étape et blocage.</p>
        </div>
        <div className="ops-scoreboard">
          <MetricPill tone="active" label="Actifs" value={activeCount} />
          <MetricPill tone="idle" label="Idle" value={idleCount} />
          <MetricPill tone="waiting" label="En attente" value={waitingCount} />
          <MetricPill tone="error" label="Erreurs" value={errorCount} />
        </div>
      </section>

      <section className="ops-toolbar card">
        <div className="ops-filter-group">
          {FILTERS.map((item) => (
            <Link
              key={item.key}
              href={item.key === 'all' ? '/office' : `/office?filter=${item.key}`}
              className={`ops-filter ${filter === item.key ? 'is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="ops-toolbar-note">Affichage : {visibleSeats.length} agent{visibleSeats.length > 1 ? 's' : ''}</div>
      </section>

      <div className="ops-layout">
        <div className="ops-main-col">
          <section className="ops-card-grid">
            {visibleSeats.map((seat) => (
              <article key={seat.id} className={`ops-agent-card tone-${seat.stateTone}`}>
                <div className="ops-agent-card__top">
                  <div className="ops-agent-card__identity">
                    <div className={`ops-agent-card__portrait tone-${seat.stateTone}`}>
                      <img
                        src={seat.agentId === 'elon' ? '/agents/elon.jpg' : '/agents/jocko.jpg'}
                        alt={seat.agentId === 'elon' ? 'Elon' : 'Jocko'}
                        className="ops-agent-card__img"
                      />
                    </div>
                    <div>
                      <div className="ops-agent-card__name">{capitalize(seat.agentId)}</div>
                      <div className="ops-agent-card__role">{seat.label}</div>
                    </div>
                  </div>
                  <div className={`ops-state-badge tone-${seat.stateTone}`}>
                    <span className="ops-state-badge__dot" />
                    {seat.stateLabel}
                  </div>
                </div>

                <div className="ops-agent-card__timers">
                  <div className="ops-stat-box">
                    <span className="ops-stat-box__label">État depuis</span>
                    <strong>{seat.statusSinceLabel}</strong>
                  </div>
                  <div className="ops-stat-box">
                    <span className="ops-stat-box__label">Dernière activité</span>
                    <strong>{seat.lastActivityLabel}</strong>
                  </div>
                </div>

                <div className="ops-agent-card__reason">{seat.statusReason}</div>

                <div className="ops-triptych">
                  <div className="ops-line-item">
                    <span className="ops-line-item__label">Now</span>
                    <span className="ops-line-item__value">{seat.currentTask}</span>
                  </div>
                  <div className="ops-line-item">
                    <span className="ops-line-item__label">Next</span>
                    <span className="ops-line-item__value">{seat.nextAction}</span>
                  </div>
                  <div className="ops-line-item">
                    <span className="ops-line-item__label">Blocker</span>
                    <span className="ops-line-item__value">{seat.blocker}</span>
                  </div>
                </div>

                <div className="ops-mini-grid">
                  <MiniInfo label="Cron" value={seat.nextCron || 'Aucun'} />
                  <MiniInfo label="Mémoire" value={seat.latestMemory || 'Aucune'} />
                  <MiniInfo label="Runtime" value={seat.runtimeHealth || 'inconnue'} />
                  <MiniInfo label="Modèle" value={seat.lastModel || 'inconnu'} />
                </div>

                {seat.runtimeIssues?.length || seat.cronIssues?.length ? (
                  <div className="ops-issues">
                    {seat.runtimeIssues?.length ? <div><strong>Runtime :</strong> {seat.runtimeIssues.join(' · ')}</div> : null}
                    {seat.cronIssues?.length ? <div><strong>Cron :</strong> {seat.cronIssues.join(' · ')}</div> : null}
                  </div>
                ) : null}
              </article>
            ))}
          </section>

          <section className="card" style={{ marginTop: 18 }}>
            <div className="ops-section-head">
              <div>
                <h3 className="ops-section-title">Vue compacte</h3>
                <p className="ops-section-subtitle">Tableau de contrôle dense pour lecture rapide.</p>
              </div>
            </div>
            <div className="ops-table-wrap">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>État</th>
                    <th>Depuis</th>
                    <th>Dernière activité</th>
                    <th>Now</th>
                    <th>Blocker</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSeats.map((seat) => (
                    <tr key={seat.id}>
                      <td>
                        <div className="ops-table__agent">{capitalize(seat.agentId)}</div>
                        <div className="ops-table__sub">{seat.label}</div>
                      </td>
                      <td><span className={`ops-state-badge tone-${seat.stateTone} compact`}><span className="ops-state-badge__dot" />{seat.stateLabel}</span></td>
                      <td>{seat.statusSinceLabel}</td>
                      <td>{seat.lastActivityLabel}</td>
                      <td>{seat.currentTask}</td>
                      <td>{seat.blocker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="ops-side-col">
          <section className="card ops-feed-card">
            <div className="ops-section-head">
              <div>
                <h3 className="ops-section-title">Activity feed</h3>
                <p className="ops-section-subtitle">Ce qui vient vraiment de se passer.</p>
              </div>
            </div>
            <div className="ops-feed-list">
              {activity.map((item, index) => (
                <div key={`${item.agent}-${item.time}-${index}`} className={`ops-feed-item tone-${item.tone}`}>
                  <div className="ops-feed-item__time">{item.time}</div>
                  <div className="ops-feed-item__body">
                    <div className="ops-feed-item__top">
                      <strong>{item.agent}</strong>
                      <span className={`ops-feed-pill tone-${item.tone}`}>{item.label}</span>
                    </div>
                    <div className="ops-feed-item__detail">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: number; tone: 'active' | 'idle' | 'waiting' | 'error' }) {
  return (
    <div className={`ops-metric-pill tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniInfo({ label, value, tone }: { label: string; value: string; tone?: 'error' }) {
  return (
    <div className={`ops-mini-info ${tone ? `tone-${tone}` : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
