import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";

/**
 * Cliente Supabase para uso no servidor (Server Components, Server Actions,
 * Route Handlers). Lê a sessão dos cookies da request.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Chamado a partir de um Server Component (não pode setar cookie).
          // O refresh de sessão acontece no middleware.
        }
      },
    },
  });
}
