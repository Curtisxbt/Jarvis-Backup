type OfficeSeat = {
  id: string;
  agentId: string;
  label: string;
  status: string;
};

const statusColor: Record<string, string> = {
  working: 'var(--success)',
  scheduled: 'var(--warning)',
  blocked: 'var(--danger)',
  idle: 'var(--muted)',
};

export function OfficeGrid({ seats }: { seats: OfficeSeat[] }) {
  return (
    <div className="grid cols-2">
      {seats.map((seat) => (
        <section key={seat.id} className="card" style={{ minHeight: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{seat.label}</h3>
            <span className="badge">{seat.status}</span>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 150 }}>
            <div style={{ position: 'relative', width: 140, height: 110 }}>
              <div style={{ position: 'absolute', bottom: 0, left: 20, width: 100, height: 18, borderRadius: 10, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'absolute', bottom: 18, left: 48, width: 44, height: 44, borderRadius: '50%', background: statusColor[seat.status] || 'var(--muted)' }} />
              <div style={{ position: 'absolute', bottom: 58, left: 58, width: 24, height: 24, borderRadius: '50%', background: '#f8fafc' }} />
              <div style={{ position: 'absolute', right: 6, bottom: 24, width: 42, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(110,168,254,0.15)' }} />
            </div>
          </div>
          <div className="muted">{seat.agentId}</div>
        </section>
      ))}
    </div>
  );
}
