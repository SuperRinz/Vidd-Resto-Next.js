"use client";

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function DashboardOwner() {
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const router = useRouter();
  const [dataSales, setDataSales] = useState([]);
  

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // Tendang ke login kalau tidak ada sesi
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
  const fetchSales = async () => {
    const res = await fetch("/api/sales");
    const data = await res.json();
    setDataSales(data);
  };
  const fetchPrediction = async () => {
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error("Gagal ambil prediksi:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchPrediction();
  fetchSales();
}, []);


  
    
  const totalOmzet = dataSales.reduce((sum, item) => sum + item.daily_revenue, 0);

  // Format sumbu Y: 500rb, 1jt, 1.5jt, dst
  const formatYAxis = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}jt`;
    return `${(val / 1_000).toFixed(0)}rb`;
  };

  // Custom tooltip chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
          <p className="font-bold text-gray-700 mb-1">Tanggal: {label}</p>
          <p className="text-blue-600 font-bold">Rp {Number(payload[0].value).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="p-10 text-center">Memuat Dashboard...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Owner</h1>

      {/* SECTION 1: METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Omzet Keseluruhan</p>
          <h2 className="text-2xl font-bold text-gray-800">Rp {totalOmzet.toLocaleString()}</h2>
          <p className="text-xs text-gray-400 mt-2">{dataSales.length} hari data tercatat</p>
        </div>

        <div className="bg-blue-600 p-6 rounded-2xl shadow-sm text-white hover:bg-blue-700 transition-colors duration-200">
          <p className="text-sm opacity-80 font-medium mb-1">Prediksi Omzet Besok</p>
          <h2 className="text-2xl font-bold">Rp {prediction?.toLocaleString(undefined, {maximumFractionDigits: 0})}</h2>
          <p className="text-xs mt-2 italic opacity-70">*Berdasarkan model Random Forest</p>
        </div>

        <div className="bg-orange-500 p-6 rounded-2xl shadow-sm text-white hover:bg-orange-600 transition-colors duration-200">
          <p className="text-sm opacity-80 font-medium mb-1">Saran AI</p>
          <h2 className="text-lg font-semibold leading-snug">
            {totalOmzet > 1000000 ? "Siapkan stok lebih banyak!" : "Stok normal saja."}
          </h2>
        </div>
      </div>

      {/* SECTION 2: GRAFIK OMZET */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Tren Omzet Harian</h3>
          {activeBar !== null && (
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
              {dataSales[activeBar]?.sales_date} — Rp {dataSales[activeBar]?.daily_revenue.toLocaleString()}
            </span>
          )}
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataSales} onMouseLeave={() => setActiveBar(null)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="sales_date"
                fontSize={12}
                tickFormatter={(str) => str.split('-')[2]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis
                fontSize={12}
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
                width={52}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eff6ff' }} />
              <Bar
                dataKey="daily_revenue"
                radius={[6, 6, 0, 0]}
                onMouseEnter={(_: any, index: number) => setActiveBar(index)}
              >
                {dataSales.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={activeBar === index ? '#1d4ed8' : '#3b82f6'}
                    opacity={activeBar === null || activeBar === index ? 1 : 0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      </div>

}