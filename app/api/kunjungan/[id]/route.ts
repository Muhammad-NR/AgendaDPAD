import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('is_admin')?.value === 'true';
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params; // <--- AWAIT ID

  const { error } = await supabase.from('agenda_kunjungan').delete().eq('id', id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PUT (EDIT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('is_admin')?.value === 'true';
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params; // <--- AWAIT ID
  const body = await request.json();
  const { title, description, date, time, end_time, location, institution_name } = body;

  const { data, error } = await supabase
    .from('agenda_kunjungan')
    .update({ title, description, date, time, end_time, location, institution_name })
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}