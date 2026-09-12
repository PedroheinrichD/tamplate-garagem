import "server-only";

import { prisma } from "@/lib/db";

/**
 * Consultas exclusivamente administrativas. Só devem ser chamadas de dentro de
 * rotas /admin já protegidas por sessão (ver requireUser / middleware).
 *
 * IMPORTANTE: leads não têm nenhuma leitura pública. Só aqui.
 */

export async function getDashboardStats() {
  const [vehicles, available, reserved, sold, photos, leadsNew, leadsTotal] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.vehicle.count({ where: { status: "RESERVED" } }),
      prisma.vehicle.count({ where: { status: "SOLD" } }),
      prisma.vehiclePhoto.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count(),
    ]);
  return { vehicles, available, reserved, sold, photos, leadsNew, leadsTotal };
}

export async function getLeads(limit = 100) {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      vehicle: { select: { slug: true, brand: true, model: true } },
    },
  });
}

const UNHIDE_ADMIN = {
  licensePlate: false,
  renavam: false,
  chassis: false,
  fipeCode: false,
  purchaseCost: false,
  internalNotes: false,
} as const;

/** Veículos COM os campos administrativos (opt-in explícito sobre o omit global). */
export async function getVehiclesForAdmin() {
  return prisma.vehicle.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    omit: UNHIDE_ADMIN,
    include: { _count: { select: { photos: true } } },
  });
}

/** Um veículo (por id do banco) com fotos ordenadas e campos internos. */
export async function getVehicleForAdmin(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    omit: UNHIDE_ADMIN,
    include: { photos: { orderBy: { position: "asc" } } },
  });
}

/** Lista enxuta (capa + nome) para o seletor de destaques (/admin/destaques). */
export async function getVehiclesForFeaturedPicker() {
  return prisma.vehicle.findMany({
    orderBy: [{ brand: "asc" }, { model: "asc" }],
    select: {
      id: true,
      brand: true,
      model: true,
      version: true,
      status: true,
      featuredPosition: true,
      photos: {
        orderBy: { position: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
    },
  });
}
