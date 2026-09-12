import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import type {
  Vehicle,
  FuelType,
  Transmission,
  BodyType,
  VehicleStatus,
} from "@/types/vehicle";

/**
 * Camada de acesso a dados dos veículos. SÓ roda no servidor (import "server-only").
 * Toda a UI consome daqui; nada de Prisma nos componentes de client.
 *
 * O Prisma devolve os enums pelo nome interno (GASOLINA, SEDA, AVAILABLE...);
 * o front usa os rótulos de exibição (Gasolina, Sedã...). Os mapas abaixo fazem
 * essa tradução no ponto de saída.
 */

const FUEL_LABEL: Record<string, FuelType> = {
  FLEX: "Flex",
  GASOLINA: "Gasolina",
  DIESEL: "Diesel",
  HIBRIDO: "Híbrido",
  ELETRICO: "Elétrico",
};

const TRANSMISSION_LABEL: Record<string, Transmission> = {
  MANUAL: "Manual",
  AUTOMATICO: "Automático",
  AUTOMATIZADO: "Automatizado",
  CVT: "CVT",
};

const BODY_LABEL: Record<string, BodyType> = {
  HATCH: "Hatch",
  SEDA: "Sedã",
  SUV: "SUV",
  PICAPE: "Picape",
  MINIVAN: "Minivan",
};

const STATUS_LABEL: Record<string, VehicleStatus> = {
  AVAILABLE: "disponivel",
  RESERVED: "reservado",
  SOLD: "vendido",
};

/**
 * Só o que toVehicle lê. Estrutural de propósito: aceita o retorno do Prisma
 * com ou sem os campos administrativos (o omit global de db.ts) e com/sem
 * include de photos.
 */
type Row = {
  slug: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  manufactureYear: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  body: string;
  color: string;
  doors: number;
  plateEnd: number;
  featuredPosition: number | null;
  status: string;
  highlights: string[];
  features: string[];
  description: string;
  photos?: { url: string; alt: string | null }[];
  _count?: { photos: number };
};

/** Prisma -> shape que o front espera (Vehicle de src/types/vehicle.ts). */
function toVehicle(row: Row): Vehicle {
  const photos = (row.photos ?? []).map((p) => ({ url: p.url, alt: p.alt }));
  return {
    id: row.slug,
    brand: row.brand,
    model: row.model,
    version: row.version,
    year: row.year,
    manufactureYear: row.manufactureYear,
    price: row.price,
    mileage: row.mileage,
    fuel: FUEL_LABEL[row.fuel] ?? "Flex",
    transmission: TRANSMISSION_LABEL[row.transmission] ?? "Manual",
    body: BODY_LABEL[row.body] ?? "Hatch",
    color: row.color,
    doors: row.doors,
    plateEnd: row.plateEnd,
    featuredPosition: row.featuredPosition,
    status: STATUS_LABEL[row.status] ?? "disponivel",
    highlights: row.highlights,
    features: row.features,
    description: row.description,
    photoCount: row._count?.photos ?? photos.length,
    photos,
  };
}

/** Veículos visíveis no site: tudo que não foi vendido. */
const VISIBLE = { status: { not: "SOLD" as const } };

const listOrder = [
  { featuredPosition: { sort: "asc" as const, nulls: "last" as const } },
  { year: "desc" as const },
  { createdAt: "desc" as const },
];

export async function getVehicles(): Promise<Vehicle[]> {
  const rows = await prisma.vehicle.findMany({
    where: VISIBLE,
    orderBy: listOrder,
    include: {
      _count: { select: { photos: true } },
      photos: { orderBy: { position: "asc" }, take: 1 },
    },
  });
  return rows.map(toVehicle);
}

export async function getFeaturedVehicles(limit = 3): Promise<Vehicle[]> {
  const rows = await prisma.vehicle.findMany({
    where: { featuredPosition: { not: null }, status: "AVAILABLE" },
    orderBy: { featuredPosition: "asc" },
    take: limit,
    include: {
      _count: { select: { photos: true } },
      photos: { orderBy: { position: "asc" }, take: 1 },
    },
  });
  return rows.map(toVehicle);
}

export const getVehicleBySlug = cache(
  async (slug: string): Promise<Vehicle | null> => {
    const row = await prisma.vehicle.findFirst({
      where: { slug, ...VISIBLE },
      include: { photos: { orderBy: { position: "asc" } } },
    });
    return row ? toVehicle(row) : null;
  },
);

/** Alias: a rota é /estoque/[id] e o `id` do front é o slug. */
export const getVehicleById = getVehicleBySlug;

export async function getRelatedVehicles(
  slug: string,
  limit = 3,
): Promise<Vehicle[]> {
  const current = await prisma.vehicle.findFirst({
    where: { slug, ...VISIBLE },
  });
  if (!current) return [];

  const others = await prisma.vehicle.findMany({
    where: { slug: { not: slug }, ...VISIBLE },
    include: {
      _count: { select: { photos: true } },
      photos: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return others
    .map((v) => ({
      v,
      score:
        (v.body === current.body ? 2 : 0) +
        (v.brand === current.brand ? 1 : 0) +
        (Math.abs(v.price - current.price) < 25000 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => toVehicle(s.v));
}

export async function getBrands(): Promise<string[]> {
  const rows = await prisma.vehicle.findMany({
    where: VISIBLE,
    distinct: ["brand"],
    select: { brand: true },
  });
  return rows
    .map((r) => r.brand)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getBodyTypes(): Promise<BodyType[]> {
  const rows = await prisma.vehicle.findMany({
    where: VISIBLE,
    distinct: ["body"],
    select: { body: true },
  });
  return rows.map((r) => BODY_LABEL[r.body] ?? "Hatch");
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const agg = await prisma.vehicle.aggregate({
    where: VISIBLE,
    _min: { price: true },
    _max: { price: true },
  });
  return { min: agg._min.price ?? 0, max: agg._max.price ?? 0 };
}

export function countVehicles(): Promise<number> {
  return prisma.vehicle.count({ where: VISIBLE });
}
