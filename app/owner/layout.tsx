export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Ini Sidebar yang bakal muncul terus di semua halaman owner */}
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h2 className="font-bold mb-10 text-xl">Owner Panel</h2>
        <nav className="space-y-4">
          <a href="/owner" className="block opacity-70 hover:opacity-100">Dashboard</a>
          <a href="/owner/laporan" className="block opacity-70 hover:opacity-100">Laporan Penjualan</a>
        </nav>
      </aside>

      {/* Konten dari page.tsx bakal muncul di sini */}
      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}