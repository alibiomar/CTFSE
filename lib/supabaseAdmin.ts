// lib/supabase.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { AppDatabase } from "@/types/supabase";
import { cookies } from "next/headers";

export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerComponentClient<AppDatabase>({ cookies }, {
    supabaseUrl,
    supabaseKey,
  });
};