/**
 * Config do Supabase. A anon key é pública por design (protegida por RLS), por
 * isso vai com NEXT_PUBLIC_. A service_role key é segredo: só server-side.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !key.startsWith("COLE_"));
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || anonKey.startsWith("COLE_")) {
    throw new Error(
      "Supabase Auth não configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.",
    );
  }
  return { url, anonKey };
}

export function isServiceRoleConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && !key.startsWith("COLE_"));
}

export function getServiceRoleEnv(): { url: string; serviceRoleKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey || serviceRoleKey.startsWith("COLE_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada no .env (necessária para upload de fotos).",
    );
  }
  return { url, serviceRoleKey };
}

/** Bucket público das fotos de veículo. */
export const VEHICLE_PHOTOS_BUCKET = "veiculos";
