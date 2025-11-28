// app/api/kunjungan/route.ts
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 1. GET: Ambil data kunjungan
export async function GET() {
  const { data, error } = await supabase
    .from('agenda_kunjungan')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 2. POST: Tambah data kunjungan (Ada field institution_name)
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('is_admin')?.value === 'true';

  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  // Tangkap end_time dari body
  const { title, description, date, time, end_time, location, institution_name } = body;

  const { data, error } = await supabase
    .from('agenda_kunjungan')
    // Masukkan end_time ke database
    .insert([{ title, description, date, time, end_time, location, institution_name }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}