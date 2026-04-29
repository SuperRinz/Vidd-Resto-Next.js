export default function KasirLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 min-h-screen">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="font-bold">Kasir Workspace - Vidd Resto</h1>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}