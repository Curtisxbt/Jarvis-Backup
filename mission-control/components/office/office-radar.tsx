import Link from 'next/link';
import { QuickTaskButton } from '@/components/actions/quick-task-button';

type OfficeRadarItem = {
  id: string;
  label: string;
  agentId: string;
  status: string;
  visualState: string;
  openTasks: number;
  blockedTasks: number;
  nextCron?: string;
  latestMemory?: string;
  sessionAge?: string;
  lastModel?: string;
  runtimeHealth?: string;
  runtimeIssues?: string[];
  cronHealth?: string;
  cronIssues?: string[];
};

export function OfficeRadar({ seats }: { seats: OfficeRadarItem[] }) {
  const elonSeat = seats.find((seat) => seat.agentId === 'elon');
  const jockoSeat = seats.find((seat) => seat.agentId === 'jocko');
  const onlineCount = seats.filter((seat) => seat.status !== 'blocked').length;
  const criticalCount = seats.filter((seat) => seat.visualState === 'critical').length;

  return (
    <div className="office-world">
      <div className="office-world__header">
        <div>
          <div className="office-world__title">Bureau vivant</div>
          <div className="office-world__subtitle">Mode Game Boy / pixel-room. Chaque agent est représenté visuellement selon son état réel.</div>
        </div>
        <div className="office-world__hud">
          <span className="office-pill">Agents online : {onlineCount}/{seats.length}</span>
          <span className="office-pill">Postes critiques : {criticalCount}</span>
        </div>
      </div>

      <div className="office-map card">
        {elonSeat ? <AgentRoom seat={elonSeat} room="elon" /> : null}
        <CentralHub seats={seats} />
        {jockoSeat ? <AgentRoom seat={jockoSeat} room="jocko" /> : null}
      </div>

      <div className="grid cols-2" style={{ marginTop: 18 }}>
        {seats.map((seat) => (
          <AgentInspector key={seat.id} seat={seat} />
        ))}
      </div>
    </div>
  );
}

function AgentRoom({ seat, room }: { seat: OfficeRadarItem; room: 'elon' | 'jocko' }) {
  const isJockoMeditation = room === 'jocko' && seat.visualState === 'meditation';

  return (
    <section className={`office-room office-room--${room} office-state--${seat.visualState}`}>
      <div className="office-room__topbar">
        <span className="office-room__name">{room === 'elon' ? 'Elon HQ' : 'Jocko Zone'}</span>
        <span className="badge">{translateVisualState(seat.visualState)}</span>
      </div>

      <div className="office-room__decor">
        <div className="office-bookshelf" />
        <div className="office-plant office-plant--left" />
        <div className="office-plant office-plant--right" />
        {isJockoMeditation ? (
          <>
            <div className="office-yoga-mat" />
            <div className="office-candle office-candle--1" />
            <div className="office-candle office-candle--2" />
            <div className="office-breath-ring" />
          </>
        ) : (
          <>
            <div className="office-desk" />
            <div className="office-monitor office-monitor--1" />
            <div className="office-monitor office-monitor--2" />
            <div className="office-keyboard" />
          </>
        )}
        {room === 'elon' ? (
          <>
            <div className="office-market-ticker">ROI // DATA // EXECUTION</div>
            <div className="office-wall-frame office-wall-frame--elon" />
            <div className="office-rug office-rug--elon" />
          </>
        ) : null}
        {room === 'jocko' && !isJockoMeditation ? (
          <>
            <div className="office-discipline-board">DISCIPLINE // BREATH // FOCUS</div>
            <div className="office-wall-frame office-wall-frame--jocko" />
            <div className="office-rug office-rug--jocko" />
            <div className="office-dumbbells" />
          </>
        ) : null}
        {room === 'jocko' && isJockoMeditation ? (
          <>
            <div className="office-meditation-board">YOGA // STILLNESS // RECOVERY</div>
            <div className="office-wall-frame office-wall-frame--zen" />
            <div className="office-rug office-rug--zen" />
          </>
        ) : null}

        <div className={`office-agent office-agent--${room} office-agent--${seat.visualState}`}>
          <div className="office-agent__aura" />
          <div className={`office-character office-character--${room} office-character--${seat.visualState}`}>
            <div className="office-character__shadow" />
            <div className="office-character__body">
              <div className="office-character__head">
                <div className="office-character__eyes" />
              </div>
              <div className="office-character__torso" />
              <div className="office-character__arm office-character__arm--left" />
              <div className="office-character__arm office-character__arm--right" />
              <div className="office-character__leg office-character__leg--left" />
              <div className="office-character__leg office-character__leg--right" />
              {room === 'elon' ? <div className="office-character__accessory office-character__accessory--laptop" /> : null}
              {room === 'jocko' && seat.visualState === 'meditation' ? <div className="office-character__accessory office-character__accessory--zen" /> : null}
              {room === 'jocko' && seat.visualState !== 'meditation' ? <div className="office-character__accessory office-character__accessory--band" /> : null}
            </div>
          </div>
          <div className="office-agent__label">{capitalize(seat.agentId)}</div>
        </div>

        {seat.latestMemory ? <div className="office-note-bubble">Mémoire mise à jour</div> : null}
        {seat.blockedTasks > 0 ? <div className="office-warning-badge">⚠ {seat.blockedTasks}</div> : null}
      </div>
    </section>
  );
}

function CentralHub({ seats }: { seats: OfficeRadarItem[] }) {
  const onlineCount = seats.filter((seat) => seat.status !== 'blocked').length;
  const criticalCount = seats.filter((seat) => seat.visualState === 'critical').length;
  const activeCount = seats.filter((seat) => seat.visualState === 'working').length;

  return (
    <section className={`office-room office-room--hub ${criticalCount ? 'office-state--critical' : 'office-state--online'}`}>
      <div className="office-room__topbar">
        <span className="office-room__name">Hub central</span>
        <span className="badge">{criticalCount ? 'sous tension' : 'stable'}</span>
      </div>
      <div className="office-room__decor office-room__decor--hub">
        <div className="office-hub-banner">{onlineCount}/{seats.length} agents online</div>
        <div className="office-hub-console" />
        <div className="office-hub-monitor office-hub-monitor--1" />
        <div className="office-hub-monitor office-hub-monitor--2" />
        <div className="office-hub-monitor office-hub-monitor--3" />
        <div className="office-rug office-rug--hub" />
        <div className="office-server-rack office-server-rack--1" />
        <div className="office-server-rack office-server-rack--2" />
        <div className="office-agent office-agent--hub office-agent--online">
          <div className="office-agent__aura" />
          <div className="office-character office-character--hub office-character--online">
            <div className="office-character__shadow" />
            <div className="office-character__body">
              <div className="office-character__head"><div className="office-character__eyes" /></div>
              <div className="office-character__torso" />
              <div className="office-character__arm office-character__arm--left" />
              <div className="office-character__arm office-character__arm--right" />
              <div className="office-character__leg office-character__leg--left" />
              <div className="office-character__leg office-character__leg--right" />
              <div className="office-character__accessory office-character__accessory--core" />
            </div>
          </div>
          <div className="office-agent__label">Core</div>
        </div>
        <div className="office-hub-stats">
          <span className="office-pill">Actifs : {activeCount}</span>
          <span className="office-pill">Critiques : {criticalCount}</span>
        </div>
      </div>
    </section>
  );
}

function AgentInspector({ seat }: { seat: OfficeRadarItem }) {
  return (
    <section className="card office-seat-card office-seat-card--inspector">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <h3 style={{ marginBottom: 4 }}>{seat.label}</h3>
          <div className="muted">{capitalize(seat.agentId)} · {translateVisualState(seat.visualState)}</div>
        </div>
        <span className="badge">{seat.runtimeHealth || 'inconnue'}</span>
      </div>

      <div className="grid" style={{ gap: 8, marginTop: 10 }}>
        <div className="muted">Tâches ouvertes : <strong style={{ color: 'var(--text)' }}>{seat.openTasks}</strong></div>
        <div className="muted">Tâches bloquées : <strong style={{ color: 'var(--text)' }}>{seat.blockedTasks}</strong></div>
        <div className="muted">Prochain cron : <strong style={{ color: 'var(--text)' }}>{seat.nextCron || 'Aucun'}</strong></div>
        <div className="muted">Santé cron : <strong style={{ color: 'var(--text)' }}>{seat.cronHealth || 'inconnue'}</strong></div>
        <div className="muted">Dernière mémoire : <strong style={{ color: 'var(--text)' }}>{seat.latestMemory || 'Aucune'}</strong></div>
        <div className="muted">Dernière activité : <strong style={{ color: 'var(--text)' }}>{seat.sessionAge || 'inconnue'}</strong></div>
        <div className="muted">Modèle : <strong style={{ color: 'var(--text)' }}>{seat.lastModel || 'inconnu'}</strong></div>
        {seat.runtimeIssues?.length ? <div className="muted code">Runtime : {seat.runtimeIssues.join(' · ')}</div> : null}
        {seat.cronIssues?.length ? <div className="muted code">Cron : {seat.cronIssues.join(' · ')}</div> : null}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        <Link href={`/tasks?owner=${encodeURIComponent(capitalize(seat.agentId))}`} className="badge badge-link">Tâches</Link>
        <Link href="/calendar" className="badge badge-link">Calendrier</Link>
        <Link href={`/memory?agent=${encodeURIComponent(seat.agentId)}`} className="badge badge-link">Mémoire</Link>
        <Link href="/team" className="badge badge-link">Diagnostic</Link>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <QuickTaskButton title={`Action ${capitalize(seat.agentId)}`} description={`Suivi bureau ${seat.label}`} owner={capitalize(seat.agentId)} />
        <QuickTaskButton
          title={`Intervention poste ${seat.label}`}
          description={`Revue rapide du poste ${seat.label} et de son état runtime.`}
          owner={capitalize(seat.agentId)}
          label="Créer intervention"
          doneLabel="Intervention créée"
          className="action-button secondary-button"
        />
      </div>
    </section>
  );
}

function translateVisualState(state: string) {
  if (state === 'working') return 'au travail';
  if (state === 'scheduled') return 'en veille planifiée';
  if (state === 'meditation') return 'méditation / yoga';
  if (state === 'critical') return 'sous tension';
  if (state === 'online') return 'présent';
  return 'calme';
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
