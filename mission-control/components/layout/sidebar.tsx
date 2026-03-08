'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const items = [
  { href: '/', label: 'Vue d’ensemble' },
  { href: '/tasks', label: 'Tâches' },
  { href: '/calendar', label: 'Calendrier' },
  { href: '/memory', label: 'Mémoire' },
  { href: '/team', label: 'Équipe' },
  { href: '/office', label: 'Bureau' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">Mission Control</div>
      <div className="brand-sub">Couche de pilotage OpenClaw pour Denis</div>
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
