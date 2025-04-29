import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance that can be reused
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export const createClient = () => supabase;