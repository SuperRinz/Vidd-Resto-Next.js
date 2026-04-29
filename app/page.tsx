import CustomerPage from "./customer/page";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <h1 className="text-xl font-black text-[#0d9488] tracking-tighter">ViddProject</h1>
        <div className="flex gap-6 text-sm font-medium text-gray-500">
          <a href="#menu" className="hover:text-[#0d9488] transition-colors">Menu</a>
          <a href="#contact" className="hover:text-[#0d9488] transition-colors">Kontak</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0fdfa] via-white to-[#f0fdfa] py-20 px-6 text-center">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#99f6e4] rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#99f6e4] rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-block bg-[#ccfbf1] text-[#0d9488] font-bold tracking-widest text-xs uppercase px-4 py-1.5 rounded-full mb-4">
            Vidd Resto Online Website
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            The More You Eat<br/>
            <span className="text-[#0d9488]">The More Delicious You Feel</span>
          </h2>
          <p className="mt-5 text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
            Pilih Menu Menu Terbaik Kami
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-xl font-black text-gray-800">50+</p>
              <p className="text-xs text-gray-400 mt-0.5">Daftar Menu</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-black text-gray-800">⭐ 4.9</p>
              <p className="text-xs text-gray-400 mt-0.5">Rating</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-black text-gray-800">15m</p>
              <p className="text-xs text-gray-400 mt-0.5">Rata-rata Siap</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION HEADER MENU */}
      <section id="menu" className="pt-14 pb-4 px-6 text-center">
        <h3 className="text-xl font-extrabold text-gray-800">🍽️ Silahkan PIlih Menu</h3>
        <p className="text-sm text-gray-400 mt-1">Disajikan dengan Bahan Bahan Kualitas Terbaik</p>
      </section>

      {/* MENU AREA */}
      <section className="pb-20 px-2">
        <CustomerPage />
      </section>

      {/* CONTACT BAR */}
      <section id="contact" className="px-6 pb-16">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden">

          {/* Header bar */}
          <div className="px-8 pt-8 pb-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Temukan Kami</p>
            <h4 className="text-lg font-bold text-white mt-1">Lokasi Kami dan Chat Whatsapp</h4>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 px-8 pb-8 pt-2">

            {/* Google Maps */}
            <a
              href="https://maps.app.goo.gl/tnj2iJJ6v9xozvMZ7o"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-4 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Lihat di Maps</p>
                <p className="text-gray-400 text-xs mt-0.5">Buka Google Maps</p>
              </div>
              <span className="ml-auto text-gray-500 group-hover:text-white transition-colors text-lg">→</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/6289618435080?text=Halo%20Vidd%20Resto%2C%20saya%20mau%20tanya..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-4 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 32 32" fill="white">
                  <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.77 1.82 6.77L2 30l7.43-1.79A13.94 13.94 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.27 19.77c-.31.87-1.82 1.67-2.5 1.77-.65.1-1.46.14-2.36-.15-.54-.17-1.24-.4-2.13-.78-3.75-1.62-6.2-5.4-6.39-5.65-.18-.25-1.5-2-.1-3.7.18-.22.4-.4.64-.54.24-.14.5-.2.76-.2.19 0 .37.01.54.02.17.01.4-.06.62.48.23.55.78 1.9.85 2.04.07.14.12.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.49-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.24 2.25 1.38.28.14.44.12.6-.07.17-.19.7-.82.89-1.1.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.24 1.55z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Chat WhatsApp</p>
                <p className="text-gray-400 text-xs mt-0.5">Respon Cepat</p>
              </div>
              <span className="ml-auto text-gray-500 group-hover:text-white transition-colors text-lg">→</span>
            </a>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-gray-100 text-center bg-gray-50">
        <p className="text-gray-800 font-black tracking-tighter text-base">ViddProject</p>
        <p className="text-gray-400 text-xs mt-1">© 2026 Ethernal Corp. Allright Reserved</p>
        <a href="/login" className="text-gray-300 hover:text-gray-400 text-[10px] transition mt-2 inline-block">
          Staff Portal
        </a>
      </footer>

    </main>
  );
}