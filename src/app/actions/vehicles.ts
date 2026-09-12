"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { vehicleSchema } from "@/lib/vehicle-schema";
import {
  uploadVehiclePhoto,
  deleteVehiclePhotoObjects,
} from "@/lib/supabase/storage";

export type VehicleFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  id?: string;
};

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function revalidateVehicle(slug?: string) {
  revalidatePath("/");
  revalidatePath("/estoque");
  revalidatePath("/admin/veiculos");
  if (slug) revalidatePath(`/estoque/${slug}`);
}

export async function saveVehicle(
  _prev: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const raw = Object.fromEntries(formData);
  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Confira os campos destacados.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const data = parsed.data;
  let newId: string | null = null;

  try {
    if (id) {
      const updated = await prisma.vehicle.update({ where: { id }, data });
      revalidateVehicle(updated.slug);
    } else {
      const created = await prisma.vehicle.create({ data });
      revalidateVehicle(created.slug);
      newId = created.id;
    }
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      (err as { code?: string }).code === "P2002"
    ) {
      return {
        ok: false,
        error: "Já existe um veículo com esse slug.",
        fieldErrors: { slug: "Slug já usado." },
      };
    }
    return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  }

  // Sem redirect() aqui: o client precisa do id pra subir as fotos escolhidas
  // no formulário de criação antes de navegar pra tela de edição.
  return newId ? { ok: true, id: newId } : { ok: true };
}

export async function deleteVehicle(id: string): Promise<void> {
  await requireUser();
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { photos: { select: { url: true } } },
  });
  if (!vehicle) redirect("/admin/veiculos");

  await deleteVehiclePhotoObjects(vehicle.photos.map((p) => p.url)).catch(
    () => {},
  );
  await prisma.vehicle.delete({ where: { id } }); // cascade nas veiculo_fotos
  revalidateVehicle(vehicle.slug);
  redirect("/admin/veiculos");
}

export async function uploadVehiclePhotos(
  vehicleId: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string; added?: number }> {
  await requireUser();
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { slug: true },
  });
  if (!vehicle) return { ok: false, error: "Veículo não encontrado." };

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { ok: false, error: "Selecione ao menos uma imagem." };

  const last = await prisma.vehiclePhoto.findFirst({
    where: { vehicleId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  let position = (last?.position ?? -1) + 1;

  try {
    for (const file of files) {
      const { url } = await uploadVehiclePhoto(vehicle.slug, file);
      await prisma.vehiclePhoto.create({
        data: { vehicleId, url, alt: null, position: position++ },
      });
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Falha no upload.",
    };
  }

  revalidateVehicle(vehicle.slug);
  return { ok: true, added: files.length };
}

export async function removeVehiclePhoto(photoId: string): Promise<void> {
  await requireUser();
  const photo = await prisma.vehiclePhoto.findUnique({
    where: { id: photoId },
    include: { vehicle: { select: { slug: true } } },
  });
  if (!photo) return;
  await deleteVehiclePhotoObjects([photo.url]).catch(() => {});
  await prisma.vehiclePhoto.delete({ where: { id: photoId } });
  revalidateVehicle(photo.vehicle.slug);
}

export async function moveVehiclePhoto(
  photoId: string,
  direction: "up" | "down",
): Promise<void> {
  await requireUser();
  const photo = await prisma.vehiclePhoto.findUnique({ where: { id: photoId } });
  if (!photo) return;

  const neighbor = await prisma.vehiclePhoto.findFirst({
    where: {
      vehicleId: photo.vehicleId,
      position:
        direction === "up" ? { lt: photo.position } : { gt: photo.position },
    },
    orderBy: { position: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.vehiclePhoto.update({
      where: { id: photo.id },
      data: { position: neighbor.position },
    }),
    prisma.vehiclePhoto.update({
      where: { id: neighbor.id },
      data: { position: photo.position },
    }),
  ]);

  const v = await prisma.vehicle.findUnique({
    where: { id: photo.vehicleId },
    select: { slug: true },
  });
  revalidateVehicle(v?.slug);
}

function revalidateFeatured() {
  revalidatePath("/");
  revalidatePath("/estoque");
  revalidatePath("/admin/destaques");
}

export async function setFeaturedPosition(
  position: 1 | 2 | 3,
  vehicleId: string,
): Promise<void> {
  await requireUser();
  await prisma.$transaction([
    prisma.vehicle.updateMany({
      where: { featuredPosition: position },
      data: { featuredPosition: null },
    }),
    prisma.vehicle.update({
      where: { id: vehicleId },
      data: { featuredPosition: position },
    }),
  ]);
  revalidateFeatured();
}

export async function clearFeaturedPosition(position: 1 | 2 | 3): Promise<void> {
  await requireUser();
  await prisma.vehicle.updateMany({
    where: { featuredPosition: position },
    data: { featuredPosition: null },
  });
  revalidateFeatured();
}
