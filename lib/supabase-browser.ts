// lib/supabase-browser.ts
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { AppDatabase } from "@/types/supabase";

let supabaseClient: ReturnType<typeof createClientComponentClient<AppDatabase>> | null = null;

export function getSupabaseBrowser() {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<AppDatabase>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  }
  return supabaseClient;
}