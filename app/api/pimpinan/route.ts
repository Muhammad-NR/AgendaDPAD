// app/api/pimpinan/route.ts
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 1. GET: Ambil semua data agenda pimpinan
export async function GET() {
  const { data, error } = await supabase
    .from('agenda_pimpinan')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('is_admin')?.value === 'true';

  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  // Tangkap end_time dari body
  const { title, description, date, time, end_time, location } = body;

  const { data, error } = await supabase
    .from('agenda_pimpinan')
    // Masukkan end_time ke database
    .insert([{ title, description, date, time, end_time, location }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}