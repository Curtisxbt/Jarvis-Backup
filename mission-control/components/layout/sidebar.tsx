'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const items = [
  { href: '/', label: 'Overview' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/memory', label: 'Memory' },
  { href: '/team', label: 'Team' },
  { href: '/office', label: 'Office' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">Mission Control</div>
      <div className="brand-sub">OpenClaw operating layer for Denis</div>
      <nav className="nav">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(active && 'active')}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
