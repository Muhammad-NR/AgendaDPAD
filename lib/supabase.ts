// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// GANTI 'URI' JADI 'URL' DI SINI BIAR COCOK SAMA .ENV
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL atau Anon Key belum disetting di .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);