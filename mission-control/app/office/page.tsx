import office from '@/data/office.json';
import { Card } from '@/components/layout/card';
import { PageHeader } from '@/components/layout/page-header';
import { OfficeGrid } from '@/components/office/office-grid';

export default function OfficePage() {
  const seats = office as Array<{ id: string; agentId: string; label: string; status: string }>;

  return (
    <>
      <PageHeader title="Office" description="Visual activity layer for the agent org." />
      <div className="grid cols-3">
        <Card>
          <div className="muted">Desks</div>
          <div className="kpi">{seats.length}</div>
        </Card>
        <Card>
          <div className="muted">Working</div>
          <div className="kpi">{seats.filter((seat) => seat.status === 'working').length}</div>
        </Card>
        <Card>
          <div className="muted">Scheduled / blocked</div>
          <div className="kpi">{seats.filter((seat) => seat.status === 'scheduled' || seat.status === 'blocked').length}</div>
        </Card>
      </div>
      <div style={{ marginTop: 18 }}>
        <OfficeGrid seats={seats} />
      </div>
    </>
  );
}
