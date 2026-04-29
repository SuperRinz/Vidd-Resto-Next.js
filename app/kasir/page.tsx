"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';


export default function HalamanKasir() {
    const router = useRouter();

useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login'); // Tendang ke login kalau tidak ada sesi
    }
  };
  checkUser();
}, [router]);

  const [menus, setMenus] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // Buat nyimpan daftar order hari ini
  const [loading, setLoading] = useState(true);
  const [namaPembeli, setNamaPembeli] = useState("");
  const [showOrders, setShowOrders] = useState(false); // Toggle tampilkan tabel
  const [activeCategory, setActiveCategory] = useState<number | null>(null); // Filter kategori
  
  const [toast, setToast] = useState<{ show: boolean; name: string }>({ show: false, name: '' });
  const [keranjang, setKeranjang] = useState<{ [key: number]: number }>({});

  const fetchInitialData = async () => {
    const { data: menuData } = await supabase.from('menu_resto').select('*');
    if (menuData) setMenus(menuData);
    
    const { data, error } = await supabase
    .from("menu_resto")
    .select("*");

  console.log(data, error);
    // Ambil data pesanan hari ini (opsional untuk langsung tampil atau pas diklik tombol)
    const today = new Date().toISOString().split('T')[0];
    const { data: orderData } = await supabase.from('pesanan').select('*').gte('date_time', today);
    if (orderData) setOrders(orderData);

    setLoading(false);
  };

    

  useEffect(() => {
    fetchInitialData(); 
  }, []);

  const updateQty = (id: number, delta: number) => {
    setKeranjang((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const totalBayar = menus.reduce((sum, item) => sum + (item.price * (keranjang[item.id] || 0)), 0);

  const filteredMenus = activeCategory === null
    ? menus
    : menus.filter(item => item.category_id === activeCategory);

  const categories = [
    { id: null, label: "🍽️ Semua" },
    { id: 1, label: "🍜 Makanan" },
    { id: 2, label: "🥤 Minuman" },
    { id: 3, label: "🍿 Snack" },
  ];

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
      fetchInitialData();
      setToast({ show: true, name: toastName });
      setTimeout(() => setToast({ show: false, name: '' }), 3500);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};

// ... di dalam return UI ...


  if (loading) return <div className="p-10 text-center text-black">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* TOAST NOTIF */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 bg-white border border-green-200 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 min-w-72">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">✅</div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Pesanan Berhasil Dibuat!</p>
            <p className="text-gray-400 text-xs mt-0.5">Terima kasih, <span className="font-semibold text-gray-600">{toast.name}</span> 🎉</p>
          </div>
          <button onClick={() => setToast({ show: false, name: '' })} className="ml-auto text-gray-300 hover:text-gray-500 text-lg leading-none">✕</button>
        </div>
      )}
      {/* AREA UTAMA (MENU & KERANJANG) */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* KIRI: DAFTAR MENU */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4 text-black">🍜 Vidd Resto POS</h1>

          {/* FILTER KATEGORI */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={String(cat.id)}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm border transition ${
                  activeCategory === cat.id
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-black border-gray-300 hover:border-orange-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenus.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <img src={item.image_url} className="w-full h-32 object-cover rounded-md mb-3" />
                <h3 className="font-bold text-black">{item.item_name}</h3>
                <p className="text-orange-600 font-bold mb-3">Rp {item.price.toLocaleString()}</p>
                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 bg-white rounded shadow text-black">-</button>
                  <span className="font-bold text-black">{keranjang[item.id] || 0}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 bg-white rounded shadow text-black">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KANAN: KERANJANG (STICKY UI) */}
        <div className="w-full md:w-80 bg-white p-6 rounded-2xl shadow-xl border border-gray-200 sticky top-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-black">🛒 Keranjang</h2>
          <input 
            type="text" 
            placeholder="Nama Pembeli" 
            className="w-full p-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-black"
            value={namaPembeli}
            onChange={(e) => setNamaPembeli(e.target.value)}
          />
          
          <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
            {menus.filter(m => keranjang[m.id] > 0).map(m => (
              <div key={m.id} className="flex justify-between text-sm">
                <span className="text-black">{m.item_name} x{keranjang[m.id]}</span>
                <span className="font-medium text-black">Rp {(m.price * keranjang[m.id]).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span className="text-black">Total:</span>
              <span className="text-orange-600">Rp {totalBayar.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={totalBayar === 0}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 disabled:bg-gray-200 transition"
            >
              Konfirmasi Pesanan
            </button>
          </div>
        </div>
      </div>
            <button 
  onClick={handleLogout}
  className="mt-4 text-sm text-red-500 hover:underline w-full text-center"
>
  Keluar Sistem (Logout)
</button>
      {/* SECTION: DAFTAR ORDER HARI INI (TOGGLE) */}
      <div className="mt-12 border-t pt-8">
        <button 
          onClick={() => setShowOrders(!showOrders)}
          className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-black transition"
        >
          {showOrders ? "🙈 Sembunyikan Order" : "📋 Lihat Order Hari Ini"}
        </button>

        {showOrders && (
          <div className="mt-6 bg-white rounded-xl shadow border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-black">ID</th>
                  <th className="p-4 text-black">Customer</th>
                  <th className="p-4 text-black">Total</th>
                  <th className="p-4 text-black">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id_pesanan} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-black">#{o.id_pesanan}</td>
                    <td className="p-4 font-medium text-black">{o.customer_name}</td>
                    <td className="p-4 text-black">Rp {o.total_harga.toLocaleString()}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(o.date_time).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}