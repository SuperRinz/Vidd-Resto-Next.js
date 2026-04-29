"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Ambil role dari tabel profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      setStatus('error');
      setErrorMsg("Gagal mengambil data profil.");
      setLoading(false);
      return;
    }

    setStatus('success');
    setTimeout(() => {
      if (profile.role === 'owner') {
        router.push('/owner');
      } else {
        router.push('/kasir');
      }
    }, 1200);

    setLoading(false);
  };

  const borderColor =
    status === 'success' ? 'border-green-400 ring-2 ring-green-300' :
    status === 'error'   ? 'border-red-400 ring-2 ring-red-300' :
    'border-gray-200';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">

      {/* Card */}
      <div
        className={`bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 transition-all duration-500 ${borderColor}`}
      >
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl">🍜</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Vidd Resto</h1>
          <p className="text-sm text-gray-400 mt-1">Masuk ke sistem kasir</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
              <input
                type="email"
                placeholder="kasir@vidresto.com"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-black shadow-sm transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-black shadow-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Feedback error */}
            {status === 'error' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <span>❌</span>
                <span>{errorMsg || "Login gagal, coba lagi."}</span>
              </div>
            )}

            {/* Feedback success */}
            {status === 'success' && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
                <span>✅</span>
                <span>Login berhasil! Mengalihkan...</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || status === 'success'}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-200 shadow-md
                ${status === 'success'
                  ? 'bg-green-500 scale-95'
                  : status === 'error'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-95'
                }
                disabled:opacity-70
              `}
            >
              {loading
                ? "Mengecek..."
                : status === 'success'
                ? "✓ Berhasil!"
                : status === 'error'
                ? "Coba Lagi"
                : "Masuk ke Sistem"
              }
            </button>
          </div>
        </form>
      </div>

      <p className="text-xs text-gray-400 mt-6">© 2025 Vidd Resto POS System</p>
    </div>
  );
}