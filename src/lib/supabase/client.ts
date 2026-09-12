"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";

/** Cliente Supabase para o browser (formulário de login do admin). */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
