"use client";

import ChatBot from '@/components/chatbot';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

type SalesData = {
  daily_revenue: number
  sales_date: string
}

export default function DashboardOwner() {
  const [dataSales, setDataSales] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. Ambil data Omzet Harian asli dari Supabase[cite: 2]
      const { data: sales } = await supabase
        .from('ml_ready_v3')
        .select('*')
        .order('sales_date', { ascending: true });
      
      if (sales) setDataSales(sales);

      // 2. Tembak API Python buat dapet Prediksi Real
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      try {
          const res = await fetch(`${API_URL}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await res.json();
        setPrediction(result.prediction);
      } catch (error) {
        console.error("Gagal konek ke API Python:", error);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const totalOmzet = dataSales.reduce((sum, item) => sum + item.daily_revenue, 0);

  const formatYAxis = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}jt`;
    return `${(val / 1_000).toFixed(0)}rb`;
  };


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

  if (loading) return <div className="p-10 text-center font-medium">Menghitung Strategi AI...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Performa Resto</h1>
        <div className="text-sm bg-white px-4 py-2 rounded-full shadow-sm border text-gray-500">
           Data Aktif: <span className="font-bold text-blue-600">{dataSales.length} Hari</span>
        </div>
      </div>

      {/* SECTION 1: METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Omzet</p>
          <h2 className="text-2xl font-bold text-gray-800">Rp {totalOmzet.toLocaleString()}</h2>
        </div>

        <div className="bg-cyan-600 p-6 rounded-2xl shadow-sm text-white">
          <p className="text-sm opacity-80 font-medium mb-1">Prediksi Omzet Besok</p>
          <h2 className="text-2xl font-bold">
            {prediction ? `Rp ${prediction.toLocaleString()}` : "Menghitung..."}
          </h2>
          <p className="text-xs mt-2 italic opacity-70">Prediksi berdasarkan model AI</p>
        </div>

        <div className="bg-purple-600 p-6 rounded-2xl shadow-sm text-white">
          <p className="text-sm opacity-80 font-medium mb-1">Saran Stok</p>
          <h2 className="text-lg font-semibold leading-snug">
            {prediction && prediction > 500000 ? "Siapkan bahan ekstra!" : "Stok aman terkendali."}
          </h2>
        </div>
      </div>

      {/* SECTION 2: GRAFIK OMZET */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Tren Penjualan Harian</h3>
          {activeBar !== null && (
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full animate-pulse">
              {dataSales[activeBar]?.sales_date} — Rp {dataSales[activeBar]?.daily_revenue.toLocaleString()}
            </span>
          )}
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataSales} onMouseLeave={() => setActiveBar(null)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="sales_date"
                fontSize={11}
                tickFormatter={(str) => str.split('-')[2]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis
                fontSize={11}
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
                width={50}
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
                    className="transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}