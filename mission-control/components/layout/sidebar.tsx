'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('mission-control-theme', nextTheme);
    setTheme(nextTheme);
  }

  return (
    <aside className="sidebar">
      <div className="brand">Mission Control</div>
      <div className="brand-sub">Couche de pilotage OpenClaw pour Denis</div>
      <button type="button" className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
      </button>
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
