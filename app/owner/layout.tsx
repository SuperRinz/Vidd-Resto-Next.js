export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)',
        color: '#fff',
        padding: '28px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}>

        {/* Logo / Brand */}
        <div style={{ padding: '0 8px', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 30, height: 30,
              borderRadius: 8,
              background: 'rgba(37,99,235,0.18)',
              border: '1px solid rgba(37,99,235,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', color: '#f9fafb', lineHeight: 1.2 }}>
                Owner Panel
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', marginTop: 1 }}>
                VIDD RESTO
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 8px 20px' }} />

        {/* Nav label */}
        <p style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase',
          padding: '0 12px', marginBottom: 8,
        }}>Menu</p>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="/owner" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.06)',
            textDecoration: 'none',
            color: '#f9fafb',
            fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
            transition: 'background 0.2s ease',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Dashboard
          </a>
          <a href="/owner/laporan" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px',
            borderRadius: 10,
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.50)',
            fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
            transition: 'all 0.2s ease',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            Laporan Penjualan
          </a>
        </nav>

        {/* Bottom spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer hint */}
        <div style={{ padding: '0 8px' }}>
          <div style={{
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '-0.01em', lineHeight: 1.5 }}>
              © 2026 Ethernal Corp
            </p>
          </div>
        </div>

      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1,
        background: 'radial-gradient(circle at top right, rgba(59,130,246,0.04), transparent 30%), #f5f7fb',
        minHeight: '100vh',
        overflow: 'auto',
      }}>
        {children}
      </main>

    </div>
  );
}