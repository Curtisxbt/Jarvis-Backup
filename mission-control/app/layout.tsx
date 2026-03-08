import '@/styles/globals.css';
import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';

export const metadata = {
  title: 'Mission Control',
  description: 'Mission Control OpenClaw pour Denis',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
