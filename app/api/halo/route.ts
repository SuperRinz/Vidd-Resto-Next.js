import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import client yang kita bikin tadi

export async function GET() {
  // Ambil data dari tabel 'profiles' (atau ganti dengan nama tabelmu yang lain)
  const { data, error } = await supabase
    .from('menu_resto') 
    .select('*')
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    pesan: "Data berhasil ditarik dari Supabase!",
    data: data 
  });
}