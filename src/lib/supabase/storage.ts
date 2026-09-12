import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  getServiceRoleEnv,
  VEHICLE_PHOTOS_BUCKET,
} from "@/lib/supabase/config";

/**
 * Storage das fotos de veículo. Upload/remoção server-side com a service_role
 * key (nunca no client). O bucket é público só para leitura, então o <Image>
 * carrega as fotos sem auth.
 */

function admin() {
  const { url, serviceRoleKey } = getServiceRoleEnv();
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

let bucketReady = false;

async function ensureBucket() {
  if (bucketReady) return;
  const supabase = admin();
  const { data } = await supabase.storage.getBucket(VEHICLE_PHOTOS_BUCKET);
  if (!data) {
    await supabase.storage.createBucket(VEHICLE_PHOTOS_BUCKET, {
      public: true,
      fileSizeLimit: "8MB",
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    });
  }
  bucketReady = true;
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadVehiclePhoto(
  vehicleSlug: string,
  file: File,
): Promise<{ url: string; path: string }> {
  await ensureBucket();
  const ext = EXT[file.type];
  if (!ext) throw new Error("Formato de imagem não suportado.");

  const path = `${vehicleSlug}/${crypto.randomUUID()}.${ext}`;
  const supabase = admin();
  const { error } = await supabase.storage
    .from(VEHICLE_PHOTOS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Upload falhou: ${error.message}`);

  const { data } = supabase.storage
    .from(VEHICLE_PHOTOS_BUCKET)
    .getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/** Extrai o path do bucket a partir da URL pública (para remover o objeto). */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${VEHICLE_PHOTOS_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}

export async function deleteVehiclePhotoObjects(urls: string[]): Promise<void> {
  const paths = urls
    .map(storagePathFromUrl)
    .filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  await admin().storage.from(VEHICLE_PHOTOS_BUCKET).remove(paths);
}
