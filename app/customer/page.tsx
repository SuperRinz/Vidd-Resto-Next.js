"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function HalamanPelanggan() {
  // ── ALL STATE UNCHANGED ──
  const [menus, setMenus] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [namaPembeli, setNamaPembeli] = useState("");
  const [showOrders, setShowOrders] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [toast, setToast] = useState<{ show: boolean; name: string }>({ show: false, name: '' });
  const [keranjang, setKeranjang] = useState<{ [key: number]: number }>({});
  const [cartOpen, setCartOpen] = useState(false);

  // ── ALL FETCH LOGIC UNCHANGED ──
  const fetchInitialData = async () => {
    const { data: menuData } = await supabase.from('menu_resto').select('*');
    if (menuData) setMenus(menuData);
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ── ALL BUSINESS LOGIC UNCHANGED ──
  const updateQty = (id: number, delta: number) => {
    setKeranjang((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const totalBayar = menus.reduce((sum, item) => sum + (item.price * (keranjang[item.id] || 0)), 0);
  const totalItems = menus.reduce((sum, item) => sum + (keranjang[item.id] || 0), 0);

  const filteredMenus = activeCategory === null
    ? menus
    : menus.filter(item => item.category_id === activeCategory);

  const categories = [
    { id: null,  label: "Semua",   emoji: "🍽️" },
    { id: 1,     label: "Makanan", emoji: "🍜" },
    { id: 2,     label: "Minuman", emoji: "🥤" },
    { id: 3,     label: "Snack",   emoji: "🍿" },
  ];

  // ── CHECKOUT LOGIC UNCHANGED ──
  const handleCheckout = async () => {
    if (!namaPembeli) return alert("Isi nama dulu, bro!");

    try {
      const { data: headerData, error: headerError } = await supabase
        .from('pesanan')
        .insert({ customer_name: namaPembeli, total_harga: totalBayar })
        .select();

      if (headerError) throw headerError;
      const orderId = headerData[0].id_pesanan;

      const detailInsert = menus
        .filter(item => keranjang[item.id] > 0)
        .map(item => ({
          id_pesanan: orderId,
          customer_name: namaPembeli,
          menu_id: item.id,
          jumlah: keranjang[item.id],
          total_harga: item.price * keranjang[item.id]
        }));

      const { error: detailError } = await supabase.from('pesanan_detail').insert(detailInsert);
      if (detailError) throw detailError;

      const toastName = namaPembeli;
      setKeranjang({});
      setNamaPembeli("");
      setCartOpen(false);
      fetchInitialData();
      setToast({ show: true, name: toastName });
      setTimeout(() => setToast({ show: false, name: '' }), 3500);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // ── LOADING STATE ──
  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full animate-spin"
          style={{
            border: '3px solid rgba(180,106,60,0.15)',
            borderTopColor: '#B46A3C',
          }}
        />
        <p className="text-[13px] font-medium" style={{ color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.01em' }}>
          Memuat menu…
        </p>
      </div>
    </div>
  );

  const cartItems = menus.filter(m => keranjang[m.id] > 0);

  return (
    <>
      {/* ══════════════════════════════════════
          SCOPED STYLES
      ══════════════════════════════════════ */}
      <style>{`
        /* ── MENU CARD ── */
        .menu-card {
          background: #FEFCF9;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 0 0.5px rgba(180,106,60,0.10), 0 2px 10px rgba(35,34,32,0.05);
          border: 1px solid rgba(180,106,60,0.07);
          transition: transform 0.26s cubic-bezier(.22,.68,0,1.2), box-shadow 0.26s ease;
          display: flex;
          flex-direction: column;
        }
        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 0.5px rgba(180,106,60,0.10), 0 16px 36px rgba(35,34,32,0.09);
        }

        /* ── CARD IMAGE ── */
        .menu-card-img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .menu-card:hover .menu-card-img {
          transform: scale(1.04);
        }

        /* ── CATEGORY PILL ── */
        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
          white-space: nowrap;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          outline: none;
        }
        .cat-pill-on {
          background: #232220;
          color: #fff;
          box-shadow: 0 3px 14px rgba(35,34,32,0.22);
        }
        .cat-pill-off {
          background: rgba(255,255,255,0.8);
          color: rgba(0,0,0,0.55);
          border: 1.5px solid rgba(0,0,0,0.08);
        }
        .cat-pill-off:hover {
          background: #fff;
          color: rgba(0,0,0,0.80);
          border-color: rgba(0,0,0,0.14);
        }

        /* ── QTY STEPPER ── */
        .qty-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 50px;
          overflow: hidden;
          background: rgba(241,232,221,0.7);
          border: 1.5px solid rgba(180,106,60,0.18);
        }
        .qty-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; line-height: 1;
          color: #B46A3C;
          background: transparent;
          border: none; cursor: pointer;
          transition: background 0.15s ease;
          flex-shrink: 0;
        }
        .qty-btn:hover { background: rgba(180,106,60,0.10); }
        .qty-btn:active { background: rgba(180,106,60,0.18); }

        /* ── ADD BUTTON (zero state) ── */
        .add-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #B46A3C;
          color: #fff;
          border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 400; line-height: 1;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(180,106,60,0.28);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex-shrink: 0;
        }
        .add-btn:hover { transform: scale(1.08); box-shadow: 0 4px 16px rgba(180,106,60,0.38); }
        .add-btn:active { transform: scale(0.94); }

        /* ── CART SIDEBAR ── */
        .cart-sidebar {
          background: #FEFCF9;
          border-radius: 20px;
          box-shadow: 0 0 0.5px rgba(180,106,60,0.08), 0 8px 32px rgba(35,34,32,0.07);
          border: 1px solid rgba(180,106,60,0.08);
          overflow: hidden;
        }

        .name-input {
          width: 100%;
          padding: 11px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(180,106,60,0.12);
          background: #F7F3ED;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0,0,0,0.87);
          letter-spacing: -0.01em;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit;
        }
        .name-input::placeholder { color: rgba(111,106,99,0.55); }
        .name-input:focus {
          border-color: #B46A3C;
          box-shadow: 0 0 0 3px rgba(180,106,60,0.10);
          background: #fff;
        }

        /* ── CHECKOUT BTN ── */
        .checkout-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: 50px;
          background: #B46A3C;
          color: #fff;
          font-size: 14px; font-weight: 700;
          letter-spacing: -0.01em;
          border: none; cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(180,106,60,0.24);
        }
        .checkout-btn:hover:not(:disabled) { background: #9e5a2f; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(180,106,60,0.30); }
        .checkout-btn:active:not(:disabled) { transform: scale(0.97); }
        .checkout-btn:disabled { background: #d1d5db; box-shadow: none; cursor: not-allowed; opacity: 1; }

        /* ── MOBILE CART PILL ── */
        .mobile-cart-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 22px;
          border-radius: 50px;
          background: #232220;
          color: #fff;
          font-size: 13px; font-weight: 700;
          letter-spacing: -0.01em;
          border: none; cursor: pointer;
          box-shadow: 0 4px 24px rgba(35,34,32,0.30), 0 1px 4px rgba(0,0,0,0.10);
          transition: all 0.22s ease;
          white-space: nowrap;
        }
        .mobile-cart-pill:hover { opacity: 0.92; transform: translateY(-1px); }
        .mobile-cart-pill:active { transform: scale(0.97); }

        /* ── MOBILE SHEET ── */
        .cart-sheet {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: #fff;
          border-radius: 24px 24px 0 0;
          padding: 24px 24px 32px;
          max-height: 85vh;
          overflow-y: auto;
          transition: transform 0.32s cubic-bezier(.32,0,.67,0);
        }
        .cart-sheet-open  { transform: translateY(0); }
        .cart-sheet-close { transform: translateY(100%); }

        /* ── BADGE ── */
        .qty-badge {
          position: absolute; top: 10px; right: 10px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #B46A3C;
          color: #fff;
          font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(180,106,60,0.35);
          border: 2px solid #fff;
        }

        /* ── SCROLLBAR HIDE ── */
        .sh::-webkit-scrollbar { display: none; }
        .sh { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── SECTION LABEL ── */
        .section-eyebrow {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #B46A3C;
          margin-bottom: 6px;
        }
        .section-title {
          font-family: 'Lora', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: rgba(0,0,0,0.87);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        /* ── TOAST ── */
        .toast-enter { animation: toastIn 0.4s cubic-bezier(.22,.68,0,1.2) both; }
        .toast-leave { animation: toastOut 0.3s ease both; }
        @keyframes toastIn  { from { opacity:0; transform: translateX(-50%) translateY(-12px) scale(0.96); } to { opacity:1; transform: translateX(-50%) translateY(0) scale(1); } }
        @keyframes toastOut { from { opacity:1; transform: translateX(-50%) scale(1); } to { opacity:0; transform: translateX(-50%) scale(0.96); } }

        /* ── TABLE ── */
        .order-table th {
          padding: 14px 20px;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(0,0,0,0.40);
          background: #f9f9f9;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .order-table td {
          padding: 14px 20px;
          font-size: 13px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .order-table tr:last-child td { border-bottom: none; }
        .order-table tr:hover td { background: #fafaf9; }
      `}</style>

      {/* ══════════════════════════════════════
          TOAST
      ══════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed', top: 24, left: '50%', zIndex: 100,
          transform: 'translateX(-50%)',
          transition: 'opacity 0.3s ease',
          opacity: toast.show ? 1 : 0,
          pointerEvents: toast.show ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid rgba(180,106,60,0.12)',
            borderRadius: 16,
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
            minWidth: 280,
            boxShadow: '0 4px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'rgba(180,106,60,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}
          >✅</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.01em', margin: 0 }}>
              Pesanan Berhasil!
            </p>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: '2px 0 0', letterSpacing: '-0.01em' }}>
              Terima kasih, <strong style={{ color: 'rgba(0,0,0,0.75)' }}>{toast.name}</strong> 
            </p>
          </div>
          <button
            onClick={() => setToast({ show: false, name: '' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.28)', fontSize: 16, lineHeight: 1, padding: 4 }}
          >✕</button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE FLOATING CART PILL
      ══════════════════════════════════════ */}
      {totalItems > 0 && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}
             className="md:hidden">
          <button className="mobile-cart-pill" onClick={() => setCartOpen(true)}>
            {/* count badge */}
            <span style={{
              background: '#B46A3C', color: '#fff',
              borderRadius: 50, minWidth: 22, height: 22,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, padding: '0 6px',
            }}>{totalItems}</span>
            <span>Lihat Keranjang</span>
            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              Rp {totalBayar.toLocaleString('id-ID')}
            </span>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          MOBILE CART BOTTOM SHEET
      ══════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          transition: 'opacity 0.28s ease',
          opacity: cartOpen ? 1 : 0,
          pointerEvents: cartOpen ? 'auto' : 'none',
        }}
        className="md:hidden"
      >
        {/* Backdrop */}
        <div
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(3px)' }}
          onClick={() => setCartOpen(false)}
        />

        {/* Sheet */}
        <div className={`cart-sheet sh ${cartOpen ? 'cart-sheet-open' : 'cart-sheet-close'}`}>
          {/* Drag handle */}
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.12)', borderRadius: 4, margin: '0 auto 20px' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.03em', margin: 0 }}>
              Keranjang Kamu
            </h2>
            {totalItems > 0 && (
              <span style={{
                background: 'rgba(180,106,60,0.08)', color: '#B46A3C',
                borderRadius: 50, padding: '3px 10px', fontSize: 12, fontWeight: 700,
              }}>{totalItems} item</span>
            )}
          </div>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Nama kamu…"
            className="name-input"
            style={{ marginBottom: 16 }}
            value={namaPembeli}
            onChange={(e) => setNamaPembeli(e.target.value)}
          />

          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            {cartItems.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={m.image_url}
                  alt={m.item_name}
                  style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.87)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                    {m.item_name}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.38)', margin: '2px 0 0' }}>×{keranjang[m.id]}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.75)', flexShrink: 0, letterSpacing: '-0.01em' }}>
                  Rp {(m.price * keranjang[m.id]).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          {/* Divider + Total */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.01em' }}>Total Pembayaran</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#B46A3C', letterSpacing: '-0.03em' }}>
                Rp {totalBayar.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Checkout */}
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={totalBayar === 0}
          >
            Konfirmasi Pesanan 
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN LAYOUT
      ══════════════════════════════════════ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 0 120px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28 }}>

          {/* ────────────────────────────────
              LEFT: MENU AREA
          ──────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── Category Pills ── */}
            <div
              className="sh"
              style={{
                display: 'flex', gap: 8,
                overflowX: 'auto', paddingBottom: 4,
                marginBottom: 24,
              }}
            >
              {categories.map((cat) => (
                <button
                  key={String(cat.id)}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`cat-pill ${activeCategory === cat.id ? 'cat-pill-on' : 'cat-pill-off'}`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* ── Section Label ── */}
            <div style={{ marginBottom: 16 }}>
              <p className="section-eyebrow">
                {activeCategory === null ? 'Semua Menu' : categories.find(c => c.id === activeCategory)?.label}
              </p>
              <p className="section-title">
                {filteredMenus.length} pilihan tersedia
              </p>
            </div>

            {/* ── Menu Grid ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))',
                gap: 14,
              }}
            >
              {filteredMenus.map((item) => (
                <div key={item.id} className="menu-card">

                  {/* Image area */}
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="menu-card-img"
                    />
                    {/* Qty badge */}
                    {keranjang[item.id] > 0 && (
                      <div className="qty-badge">{keranjang[item.id]}</div>
                    )}
                    {/* Category chip */}
                    <div style={{
                      position: 'absolute', bottom: 8, left: 8,
                      background: 'rgba(255,255,255,0.88)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: 50, padding: '3px 9px',
                      fontSize: 10, fontWeight: 700,
                      color: 'rgba(0,0,0,0.55)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
                      {item.category_id === 1 ? 'Makanan' : item.category_id === 2 ? 'Minuman' : 'Snack'}
                    </div>
                  </div>

                  {/* Info area */}
                  <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <h3 style={{
                      fontSize: 13, fontWeight: 700,
                      color: 'rgba(0,0,0,0.87)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                      margin: 0,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                    }}>
                      {item.item_name}
                    </h3>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Price + stepper row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{
                        fontSize: 14, fontWeight: 800,
                        color: '#B46A3C',
                      }}>
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>

                      {/* Qty stepper / add button */}
                      {keranjang[item.id] > 0 ? (
                        <div className="qty-stepper">
                          <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(0,0,0,0.80)', minWidth: 18, textAlign: 'center', letterSpacing: '-0.02em' }}>
                            {keranjang[item.id]}
                          </span>
                          <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={() => updateQty(item.id, 1)} aria-label={`Tambah ${item.item_name}`}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3v10M3 8h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredMenus.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontSize: 36, marginBottom: 10 }}>🍽️</p>
                <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.38)', fontWeight: 500 }}>Menu tidak tersedia</p>
              </div>
            )}

          </div>{/* end LEFT */}

          {/* ────────────────────────────────
              RIGHT: CART SIDEBAR (desktop)
          ──────────────────────────────── */}
          <div
            className="hidden md:block"
            style={{ width: 300, flexShrink: 0, position: 'sticky', top: 88 }}
          >
            <div className="cart-sidebar">

              {/* Cart header */}
              <div style={{
                padding: '20px 22px 16px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: 'rgba(0,0,0,0.87)', letterSpacing: '-0.03em', margin: 0 }}>
                  Keranjang
                </h2>
                {totalItems > 0 && (
                  <span style={{
                    background: 'rgba(180,106,60,0.09)', color: '#B46A3C',
                    borderRadius: 50, padding: '3px 10px', fontSize: 11, fontWeight: 700,
                  }}>{totalItems} item</span>
                )}
              </div>

              <div style={{ padding: '18px 22px 22px' }}>

                {/* Name input */}
                <input
                  type="text"
                  placeholder="Nama kamu…"
                  className="name-input"
                  style={{ marginBottom: 18 }}
                  value={namaPembeli}
                  onChange={(e) => setNamaPembeli(e.target.value)}
                />

                {/* Cart items list */}
                <div
                  className="sh"
                  style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}
                >
                  {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <p style={{ fontSize: 28, marginBottom: 8 }}>🧺</p>
                      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>Keranjang masih kosong</p>
                    </div>
                  ) : (
                    cartItems.map(m => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={m.image_url}
                          alt={m.item_name}
                          style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.82)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                            {m.item_name}
                          </p>
                          <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.36)', margin: '2px 0 0' }}>×{keranjang[m.id]}</p>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.70)', flexShrink: 0, letterSpacing: '-0.01em' }}>
                          Rp {(m.price * keranjang[m.id]).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Total + CTA */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', letterSpacing: '-0.01em' }}>Total</span>
                    <span style={{ fontSize: 19, fontWeight: 800, color: '#B46A3C', letterSpacing: '-0.03em' }}>
                      Rp {totalBayar.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={totalBayar === 0}
                  >
                    Konfirmasi Pesanan 
                  </button>
                </div>

              </div>
            </div>
          </div>{/* end RIGHT */}

        </div>{/* end flex row */}

        {/* ── ORDER HISTORY TABLE ── */}
        {showOrders && orders.length > 0 && (
          <div style={{
            marginTop: 48,
            background: '#fff',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 0 0.5px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <table className="order-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>ID</th>
                  <th style={{ textAlign: 'left' }}>Customer</th>
                  <th style={{ textAlign: 'left' }}>Total</th>
                  <th style={{ textAlign: 'left' }}>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id_pesanan}>
                    <td style={{ fontFamily: 'monospace', color: 'rgba(0,0,0,0.38)', fontSize: 12 }}>#{o.id_pesanan}</td>
                    <td style={{ fontWeight: 600, color: 'rgba(0,0,0,0.82)' }}>{o.customer_name}</td>
                    <td style={{ fontWeight: 700, color: '#B46A3C' }}>Rp {o.total_harga.toLocaleString('id-ID')}</td>
                    <td style={{ color: 'rgba(0,0,0,0.40)', fontSize: 12 }}>{new Date(o.date_time).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>{/* end main layout */}
    </>
  );
}