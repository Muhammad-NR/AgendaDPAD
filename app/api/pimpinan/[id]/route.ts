import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// DELETE: Hapus Data
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Definisikan tipe Promise
) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('is_admin')?.value === 'true';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. WAJIB DI-AWAIT DI NEXT.JS 15
  const { id } = await params; 

  const { error } = await supabase
    .from('agenda_pimpinan')
    .delete()
    .eq('id', id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}

// PUT: Edit Data
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Definisikan tipe Promise
) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('is_admin')?.value === 'true';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. WAJIB DI-AWAIT DI NEXT.JS 15
  const { id } = await params;
  
  const body = await request.json();
  const { title, description, date, time, end_time, location } = body;

  const { data, error } = await supabase
    .from('agenda_pimpinan')
    .update({ title, description, date, time, end_time, location })
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}