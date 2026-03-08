import Link from 'next/link';

type LinkedEntity = {
  id: string;
  label: string;
  meta: string;
  href?: string;
};

export function LinkedEntities({ title, items }: { title: string; items: LinkedEntity[] }) {
  if (!items.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div className="muted" style={{ marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {items.map((item) =>
          item.href ? (
            <Link key={item.id} href={item.href} className="badge badge-link" title={item.meta}>
              {item.label}
            </Link>
          ) : (
            <span key={item.id} className="badge" title={item.meta}>{item.label}</span>
          ),
        )}
      </div>
    </div>
  );
}
