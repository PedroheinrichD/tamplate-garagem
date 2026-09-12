import "server-only";

import { v2 as cloudinary } from "cloudinary";

/**
 * Storage das fotos de veículo (Cloudinary). Upload/remoção server-side com a
 * API secret (nunca no client). Cada veículo tem sua própria pasta
 * (`veiculos/<slug>`) no Cloudinary.
 */

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function configure() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary não configurado. Preencha CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env.",
    );
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"];

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadVehiclePhoto(
  vehicleSlug: string,
  file: File,
): Promise<{ url: string }> {
  if (!EXT[file.type]) throw new Error("Formato de imagem não suportado.");
  configure();

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `veiculos/${vehicleSlug}`,
        public_id: crypto.randomUUID(),
        resource_type: "image",
        allowed_formats: ALLOWED_FORMATS,
        overwrite: false,
      },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(new Error(error?.message ?? "Upload falhou."));
        } else {
          resolve(uploaded);
        }
      },
    );
    stream.end(buffer);
  });

  return { url: result.secure_url };
}

/** Extrai o public_id a partir da URL do Cloudinary (para remover o objeto). */
function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match ? match[1] : null;
}

export async function deleteVehiclePhotoObjects(urls: string[]): Promise<void> {
  const ids = urls.map(publicIdFromUrl).filter((id): id is string => Boolean(id));
  if (ids.length === 0) return;
  configure();
  await Promise.all(
    ids.map((id) => cloudinary.uploader.destroy(id, { resource_type: "image" })),
  );
}
