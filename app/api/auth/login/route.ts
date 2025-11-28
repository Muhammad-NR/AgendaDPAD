// app/api/auth/login/route.ts
import { supabase } from '@/lib/supabase'; // <-- Ubah import ini
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // 1. Cek kredensial ke Supabase
  // Gunakan variable 'supabase' yang sudah kita setup di lib
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !admin) {
    return NextResponse.json({ error: 'Username atau Password salah!' }, { status: 401 });
  }

  // 2. Kalau benar, set cookie "admin_session"
  // Perbaikan: cookies() harus di-await dulu
  const cookieStore = await cookies();

  cookieStore.set('admin_session', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 hari
  });

  return NextResponse.json({ success: true });
}