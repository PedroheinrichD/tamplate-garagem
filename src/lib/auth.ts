import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Sessão atual (ou null). Nunca lança: sem Supabase configurado retorna null. */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/** Exige sessão; sem ela, manda para o login. Uso em páginas do admin. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
