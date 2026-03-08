import '@/styles/globals.css';
import { ReactNode } from 'react';
import Script from 'next/script';
import { Sidebar } from '@/components/layout/sidebar';

export const metadata = {
  title: 'Mission Control',
  description: 'Mission Control OpenClaw pour Denis',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem('mission-control-theme');var theme=saved==='dark'||saved==='light'?saved:'light';document.documentElement.setAttribute('data-theme',theme);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        <div className="app-shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
