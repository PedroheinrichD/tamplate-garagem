/**
 * Config do Supabase Storage (fotos de veículo). Auth agora é Better Auth
 * (src/lib/better-auth.ts) - o Supabase só guarda os arquivos.
 */
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
