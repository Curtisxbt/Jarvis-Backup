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
    <html lang="fr">
      <body>
        <div id="mc-live-status" style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999, padding: '8px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(10,15,25,0.88)', color: '#dbe7ff', fontSize: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)' }}>
          Live: initialisation…
        </div>
        <div className="app-shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
        <Script
          id="mc-live-runtime"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  const TARGET_PATHS = new Set(['/', '/team', '/calendar', '/office']);
  const statusEl = document.getElementById('mc-live-status');
  const path = window.location.pathname;
  if (!TARGET_PATHS.has(path)) {
    if (statusEl) statusEl.textContent = 'Live: inactif sur cette page';
    return;
  }

  let digest = null;
  let reconnectTimer = null;
  let reloading = false;
  let source = null;

  const setStatus = (text) => {
    if (statusEl) statusEl.textContent = text;
  };

  const connect = () => {
    setStatus('Live: connexion…');
    source = new EventSource('/api/team?stream=1');

    source.addEventListener('snapshot', (event) => {
      try {
        const payload = JSON.parse(event.data);
        const nextDigest = payload.digest || null;
        const stamp = new Date(payload.ts || Date.now()).toLocaleTimeString('fr-FR');

        if (digest === null) {
          digest = nextDigest;
          setStatus('Live: synchronisé à ' + stamp);
          return;
        }

        if (nextDigest && nextDigest !== digest && !reloading) {
          reloading = true;
          setStatus('Live: changement détecté, actualisation…');
          window.location.reload();
          return;
        }

        setStatus('Live: synchronisé à ' + stamp);
      } catch (error) {
        setStatus('Live: erreur de lecture');
      }
    });

    source.addEventListener('error', () => {
      setStatus('Live: reconnexion…');
      try { source && source.close(); } catch {}
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      reconnectTimer = window.setTimeout(connect, 4000);
    });
  };

  connect();
  window.addEventListener('beforeunload', () => {
    try { source && source.close(); } catch {}
  });
})();
            `,
          }}
        />
      </body>
    </html>
  );
}
