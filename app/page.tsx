import CustomerPage from "./customer/page";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F7F3ED',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#1E1E1E',
      }}
    >

      {/* ══ FONTS & GLOBAL STYLES ══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── TOKENS ── */
        :root {
          --ivory:      #F7F3ED;
          --ivory-2:    #ECE4D8;
          --charcoal:   #232220;
          --espresso:   #2E2B28;
          --copper:     #B46A3C;
          --bronze:     #C59A72;
          --text-1:     #1E1E1E;
          --text-2:     #6F6A63;
          --border:     rgba(35,34,32,0.08);
        }

        /* ── SCROLLBAR ── */
        .sh::-webkit-scrollbar { display: none; }
        .sh { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        .fu-1 { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.1) 0.05s both; }
        .fu-2 { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.1) 0.15s both; }
        .fu-3 { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.1) 0.25s both; }
        .fu-4 { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.1) 0.38s both; }
        .fu-5 { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.1) 0.50s both; }
        .fb-a { animation: floatA 4s ease-in-out infinite; }
        .fb-b { animation: floatB 4s ease-in-out 1.3s infinite; }
        .fb-c { animation: floatA 4s ease-in-out 2.4s infinite; }

        /* ── NAVBAR ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(247,243,237,0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.3s ease;
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo-mark {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: var(--charcoal);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--charcoal);
        }
        .nav-logo-text em {
          font-style: normal;
          color: var(--copper);
        }
        .nav-link {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-2);
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }
        .nav-link:hover { color: var(--copper); }
        .nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 50px;
          background: var(--charcoal);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 12px rgba(35,34,32,0.18);
        }
        .nav-cta:hover {
          background: var(--espresso);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(35,34,32,0.22);
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          overflow: hidden;
          padding: 64px 28px 52px;
          background:
            radial-gradient(ellipse 60% 50% at 80% 10%, rgba(180,106,60,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 5%  90%, rgba(197,154,114,0.07) 0%, transparent 60%),
            #F7F3ED;
        }
        .hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 64px;
        }
        .hero-text { flex: 1; }
        .hero-visual { flex: 1; display: flex; justify-content: center; align-items: center; }

        .eyebrow-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 50px;
          background: rgba(180,106,60,0.08);
          border: 1px solid rgba(180,106,60,0.15);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--copper);
          margin-bottom: 24px;
        }
        .eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--copper);
          animation: floatA 2s ease-in-out infinite;
        }

        .hero-heading {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--charcoal);
          margin-bottom: 22px;
        }
        .hero-heading em {
          font-style: italic;
          color: var(--copper);
        }

        .hero-body {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-2);
          max-width: 420px;
          margin-bottom: 36px;
          letter-spacing: -0.01em;
        }

        .hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-bottom: 44px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 50px;
          background: var(--copper);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(180,106,60,0.18);
        }
        .btn-primary:hover {
          background: #9e5a2f;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(180,106,60,0.24);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 50px;
          background: transparent;
          color: var(--charcoal);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.02em;
          text-decoration: none;
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-ghost:hover {
          border-color: rgba(35,34,32,0.22);
          background: rgba(35,34,32,0.03);
          transform: translateY(-1px);
        }

        .hero-stats {
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .hero-stat-num {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--charcoal);
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 11px;
          color: var(--text-2);
          font-weight: 500;
          margin-top: 3px;
          letter-spacing: 0.01em;
        }
        .stat-divider {
          width: 1px;
          height: 32px;
          background: var(--border);
        }

        /* ── HERO VISUAL ── */
        .hero-img-wrap {
          position: relative;
          width: 340px;
          height: 340px;
        }
        @media (min-width: 1024px) {
          .hero-img-wrap { width: 400px; height: 400px; }
        }
        .hero-img-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180,106,60,0.12) 0%, transparent 72%);
        }
        .hero-img-circle {
          position: absolute;
          inset: 16px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--ivory-2);
          box-shadow:
            0 0 0 1px rgba(180,106,60,0.08),
            0 20px 60px rgba(35,34,32,0.12),
            0 4px 12px rgba(35,34,32,0.06);
        }
        .hero-img-circle img {
          width: 100%; height: 100%; object-fit: cover;
          display: block;
        }

        /* Floating badge base */
        .f-badge {
          position: absolute;
          background: #fff;
          border-radius: 18px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 24px rgba(35,34,32,0.10), 0 1px 4px rgba(35,34,32,0.06);
          border: 1px solid rgba(35,34,32,0.05);
          white-space: nowrap;
        }
        .f-badge-title { font-size: 12px; font-weight: 800; color: var(--charcoal); line-height: 1.2; letter-spacing: -0.02em; }
        .f-badge-sub   { font-size: 10px; color: var(--text-2); margin-top: 1px; }
        .f-badge-icon  { font-size: 20px; line-height: 1; }

        /* ── PROMO BANNER ── */
        .promo-section { padding: 12px 28px 0; }
        .promo-inner   { max-width: 1280px; margin: 0 auto; }
        .promo-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          padding: 28px 34px;
          background: linear-gradient(135deg, #F1E8DD 0%, #ECE1D3 100%);
          border: 1px solid rgba(180,106,60,0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          box-shadow: 0 8px 30px rgba(35,34,32,0.06);
        }
        .promo-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--copper);
          margin-bottom: 10px;
          position: relative; z-index: 1;
        }
        .promo-heading {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 700;
          line-height: 1.2;
          color: var(--charcoal);
          letter-spacing: -0.025em;
          position: relative; z-index: 1;
        }
        .promo-heading em { font-style: italic; color: var(--copper); }
        .promo-sub {
          font-size: 13px;
          color: var(--text-2);
          margin-top: 10px;
          letter-spacing: -0.01em;
          position: relative; z-index: 1;
        }

        /* ── INTRO STRIP ── */
        .intro-strip {
          padding: 48px 28px 0;
          max-width: 1280px;
          margin: 0 auto; 
        }
        .intro-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .intro-card {
          padding: 22px 22px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid var(--border);
          box-shadow: 0 1px 6px rgba(35, 32, 32, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .intro-card.featured {
          background: #F5EDE3;
          border-color: rgba(180,106,60,0.12);
        }
        .intro-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(35,34,32,0.07);
        }
        .intro-icon {
          width: 44px; height: 44px;
          border-radius: 14px;
          background: rgba(180,106,60,0.08);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .intro-title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .intro-body {
          font-size: 12px;
          color: var(--text-2);
          line-height: 1.6;
          letter-spacing: -0.01em;
        }

        /* ── SECTION HEADER ── */
        .section-header {
          padding: 56px 28px 24px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .section-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--copper);
          margin-bottom: 8px;
        }
        .section-heading {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          color: var(--charcoal);
          letter-spacing: -0.03em;
          line-height: 1.15;
        }
        .section-sub {
          font-size: 13px;
          color: var(--text-2);
          margin-top: 8px;
          letter-spacing: -0.01em;
        }

        /* ── CONTACT ── */
        .contact-section {
          padding: 24px 28px 56px;
        }
        .contact-inner {
          max-width: 680px;
          margin: 0 auto;
        }
        .contact-card-wrap {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(35,34,32,0.07);
          background: #F5EDE3;
          border: 1px solid rgba(180,106,60,0.10);
        }
        .contact-card-body {
          padding: 32px 36px;
          position: relative;
        }
        .contact-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 14px;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(180,106,60,0.08);
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          cursor: pointer;
        }
        .contact-item:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(180,106,60,0.16);
          transform: translateX(3px);
        }
        .contact-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .contact-label { font-size: 14px; font-weight: 700; color: var(--charcoal); letter-spacing: -0.02em; }
        .contact-sub   { font-size: 11px; color: var(--text-2); margin-top: 2px; letter-spacing: -0.01em; }
        .contact-arrow { margin-left: auto; color: rgba(111,106,99,0.35); font-size: 14px; transition: color 0.2s ease, transform 0.2s ease; }
        .contact-item:hover .contact-arrow { color: var(--copper); transform: translateX(3px); }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid var(--border);
          background:
            radial-gradient(ellipse at 50% 100%, rgba(180,106,60,0.04) 0%, transparent 60%),
            var(--ivory);
          padding: 44px 28px 36px;
          text-align: center;
        }
        .footer-logo {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 12px;
        }
        .footer-logo-mark {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: var(--charcoal);
          display: flex; align-items: center; justify-content: center;
        }
        .footer-logo-text {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--charcoal);
        }
        .footer-logo-text em { font-style: normal; color: var(--copper); }
        .footer-copy {
          font-size: 11px;
          color: var(--text-2);
          letter-spacing: -0.01em;
        }
        .footer-staff {
          font-size: 10px;
          color: rgba(111,106,99,0.4);
          text-decoration: none;
          margin-top: 14px;
          display: inline-block;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
        }
        .footer-staff:hover { color: var(--text-2); }

        /* ── MENU AREA WRAPPER ── */
        .menu-area {
          padding: 0 28px 100px;
        }
        .menu-area-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── COPPER RULE ── */
        .copper-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180,106,60,0.18) 30%, rgba(180,106,60,0.18) 70%, transparent);
          margin: 0 28px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .hero { padding: 48px 20px 56px; }
          .hero-inner { flex-direction: column-reverse; gap: 40px; }
          .hero-text { text-align: center; }
          .hero-body { margin-left: auto; margin-right: auto; }
          .hero-btns { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-img-wrap { width: 280px; height: 280px; }
          .promo-section { padding: 12px 16px 0; }
          .promo-card { padding: 28px 24px; flex-direction: column; align-items: flex-start; gap: 22px; }
          .intro-grid { grid-template-columns: 1fr; }
          .intro-strip { padding: 36px 16px 0; }
          .section-header { padding: 44px 16px 20px; }
          .menu-area { padding: 0 12px 100px; }
          .contact-section { padding: 16px 16px 48px; }
          .contact-card-body { padding: 24px 20px; }
          .navbar-inner { padding: 0 20px; }
          .footer { padding: 36px 20px 28px; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav className="navbar">
        <div className="navbar-inner">

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            {/* Logo mark — replace inner content with <img> if you have a logo */}
            <div className="nav-logo-mark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C5.24 2 3 4.24 3 7c0 2.08 1.22 3.88 3 4.72V13h4v-1.28A5 5 0 0013 7c0-2.76-2.24-5-5-5z" fill="#B46A3C" opacity="0.9"/>
                <rect x="6" y="13" width="4" height="1.5" rx="0.75" fill="white" opacity="0.6"/>
              </svg>
            </div>
            <span className="nav-logo-text">Vidd<em>Resto</em></span>
          </a>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#menu"    className="nav-link" style={{ display: 'none' }}>Menu</a>
            <a href="#contact" className="nav-link" style={{ display: 'none' }}>Kontak</a>
            {/* Show links on larger screens — use Tailwind class override or JS if needed */}
            <a href="#menu"    className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: '#6F6A63', textDecoration: 'none', letterSpacing: '-0.01em' }}>Menu</a>
            <a href="#contact" className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: '#6F6A63', textDecoration: 'none', letterSpacing: '-0.01em' }}>Kontak</a>
            <a href="#menu" className="nav-cta">
              Pesan Sekarang
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hero">

        {/* Subtle grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }} />

        <div className="hero-inner" style={{ position: 'relative', zIndex: 1 }}>

          {/* TEXT */}
          <div className="hero-text">

            <div className="eyebrow-tag fu-1">
              <span className="eyebrow-dot" />
              Buka Sekarang · Delivery 15 Menit
            </div>

            <h1 className="hero-heading fu-2">
              Cita Rasa<br />
              <em>Autentik,</em><br />
              Hadir Cepat.
            </h1>

            <p className="hero-body fu-3">
              Masakan hangat dari bahan segar pilihan.
              Setiap hidangan dibuat dengan teliti —
              siap tersaji dalam 15 menit.
            </p>

            <div className="hero-btns fu-4">
              <a href="#menu" className="btn-primary">
                Pesan Sekarang
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#menu" className="btn-ghost">Lihat Menu</a>
            </div>

            <div className="hero-stats fu-5">
              <div>
                <div className="hero-stat-num">50+</div>
                <div className="hero-stat-label">Pilihan Menu</div>
              </div>
              <div className="stat-divider" />
              <div>
                <div className="hero-stat-num" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#B46A3C">
                    <path d="M8 1l1.76 3.57L14 5.27l-3 2.92.71 4.14L8 10.25l-3.71 2.08L5 8.19 2 5.27l4.24-.7L8 1z"/>
                  </svg>
                  4.9
                </div>
                <div className="hero-stat-label">Rating</div>
              </div>
              <div className="stat-divider" />
              <div>
                <div className="hero-stat-num">15m</div>
                <div className="hero-stat-label">Siap Saji</div>
              </div>
            </div>

          </div>

          {/* VISUAL */}
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <div className="hero-img-ring" />
              <div className="hero-img-circle">
                <img src="\44332377578864430.jpg" alt="Signature dish" />
              </div>

              {/* Badge: Rating */}
              <div className="f-badge fb-a" style={{ top: '-8px', right: '-16px' }}>
                <span className="f-badge-icon">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="#B46A3C">
                    <path d="M8 1l1.76 3.57L14 5.27l-3 2.92.71 4.14L8 10.25l-3.71 2.08L5 8.19 2 5.27l4.24-.7L8 1z"/>
                  </svg>
                </span>
                <div>
                  <div className="f-badge-title">4.9 Rating</div>
                  <div className="f-badge-sub">1.2k ulasan</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          PROMO BANNER
      ══════════════════════════════════════ */}
      <section className="promo-section">
        <div className="promo-inner">
          <div className="promo-card">

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="promo-eyebrow">PROMO SPESIAL</p>
              <h3 className="promo-heading">
                Gratis Minuman —<br />
                <em>Setiap Pembelian 2 Porsi</em>
              </h3>
              <p className="promo-sub">Berlaku setiap hari, tanpa kode promo.</p>
            </div>

            <a href="#menu" className="btn-primary" style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
              Klaim Sekarang
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INTRO CARDS (3 pillars)
      ══════════════════════════════════════ */}
      <div className="intro-strip">
        <div className="intro-grid">

          <div className="intro-card">
            <div className="intro-icon">
              {/* Leaf icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B46A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div className="intro-title">Bahan Segar</div>
            <p className="intro-body">Dipilih setiap pagi dari pasar lokal. Tidak ada bahan instan di dapur kami.</p>
          </div>

          <div className="intro-card featured">
            <div className="intro-icon">
              {/* Timer icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B46A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="13" r="8"/>
                <path d="M12 9v4l2 2"/>
                <path d="M5 3 2 6"/>
                <path d="m22 6-3-3"/>
                <path d="M6.38 18.7 4 21"/>
                <path d="M17.64 18.67 20 21"/>
              </svg>
            </div>
            <div className="intro-title">Cepat Tersaji</div>
            <p className="intro-body">Pesanan diproses langsung. Siap saji dalam 15 menit sejak konfirmasi.</p>
          </div>

          <div className="intro-card">
            <div className="intro-icon">
              {/* Chef Hat icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B46A3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                <line x1="6" x2="18" y1="17" y2="17"/>
              </svg>
            </div>
            <div className="intro-title">Dimasak dengan Cinta</div>
            <p className="intro-body">Setiap hidangan disiapkan oleh koki berpengalaman dengan resep tradisional.</p>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════
          MENU SECTION HEADER
      ══════════════════════════════════════ */}
      <div id="menu" className="section-header">
        <p className="section-eyebrow">MENU KAMI</p>
        <h2 className="section-heading">Pilih yang Kamu Suka</h2>
        <p className="section-sub">Bahan fresh pilihan, dimasak dengan cinta setiap hari</p>
      </div>

      {/* ══════════════════════════════════════
          MENU AREA
      ══════════════════════════════════════ */}
      <section className="menu-area">
        <div className="menu-area-inner">
          <CustomerPage />
        </div>
      </section>

      {/* ══════════════════════════════════════
          COPPER RULE
      ══════════════════════════════════════ */}
      <div className="copper-rule" />

      {/* ══════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════ */}
      <section id="contact" className="contact-section">
        <div className="contact-inner">

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p className="section-eyebrow" style={{ marginBottom: 8 }}>TEMUKAN KAMI</p>
            <h3 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: 'var(--charcoal)',
            }}>
              Hubungi &amp; Kunjungi Kami
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8, letterSpacing: '-0.01em' }}>
              Kami selalu siap melayani dengan sepenuh hati.
            </p>
          </div>

          <div className="contact-card-wrap">
            <div className="contact-card-body">
              <div className="contact-row">

                {/* Google Maps */}
                <a
                  href="https://maps.app.goo.gl/tnj2iJJ6v9xozvMZ7o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                >
                  <div className="contact-icon-wrap" style={{ background: '#fff' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                      <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <div className="contact-label">Lihat di Maps</div>
                    <div className="contact-sub">Buka Google Maps</div>
                  </div>
                  <span className="contact-arrow">→</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6289618435080?text=Halo%20Vidd%20Resto%2C%20saya%20mau%20tanya..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                >
                  <div className="contact-icon-wrap" style={{ background: '#25D366' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="white">
                      <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.77 1.82 6.77L2 30l7.43-1.79A13.94 13.94 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.27 19.77c-.31.87-1.82 1.67-2.5 1.77-.65.1-1.46.14-2.36-.15-.54-.17-1.24-.4-2.13-.78-3.75-1.62-6.2-5.4-6.39-5.65-.18-.25-1.5-2-.1-3.7.18-.22.4-.4.64-.54.24-.14.5-.2.76-.2.19 0 .37.01.54.02.17.01.4-.06.62.48.23.55.78 1.9.85 2.04.07.14.12.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.49-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.24 2.25 1.38.28.14.44.12.6-.07.17-.19.7-.82.89-1.1.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.24 1.55z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="contact-label">Chat WhatsApp</div>
                    <div className="contact-sub">Respon Cepat</div>
                  </div>
                  <span className="contact-arrow">→</span>
                </a>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="footer">
        <div className="footer-logo">
          <div className="footer-logo-mark">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C5.24 2 3 4.24 3 7c0 2.08 1.22 3.88 3 4.72V13h4v-1.28A5 5 0 0013 7c0-2.76-2.24-5-5-5z" fill="#B46A3C" opacity="0.9"/>
              <rect x="6" y="13" width="4" height="1.5" rx="0.75" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <span className="footer-logo-text">Vidd<em>Resto</em></span>
        </div>
        <p className="footer-copy">© 2026 Ethernal Corp. All Rights Reserved.</p>
        <a href="/login" className="footer-staff">Staff Portal</a>
      </footer>

    </main>
  );
}