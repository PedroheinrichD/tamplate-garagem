import type { Vehicle } from "@/types/vehicle";

/**
 * Helpers puros de veículo: formatação e filtro/ordenação em memória.
 * Sem Prisma, sem `server-only` - podem rodar no client (o EstoqueBrowser filtra
 * a lista já carregada no browser).
 */

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatMileage(value: number): string {
  return `${numberFormatter.format(value)} km`;
}

export function formatYear(v: Pick<Vehicle, "year" | "manufactureYear">): string {
  return v.manufactureYear === v.year
    ? String(v.year)
    : `${v.manufactureYear}/${v.year}`;
}

export type SortKey =
  | "relevancia"
  | "menor-preco"
  | "maior-preco"
  | "mais-novo"
  | "menos-km";

export interface VehicleFilters {
  search?: string;
  brands?: string[];
  bodies?: Vehicle["body"][];
  maxPrice?: number;
  minYear?: number;
  sort?: SortKey;
}

export function filterVehicles(list: Vehicle[], f: VehicleFilters): Vehicle[] {
  let out = list.slice();

  if (f.search?.trim()) {
    const q = f.search.trim().toLowerCase();
    out = out.filter((v) =>
      `${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(q),
    );
  }
  if (f.brands?.length) {
    out = out.filter((v) => f.brands!.includes(v.brand));
  }
  if (f.bodies?.length) {
    out = out.filter((v) => f.bodies!.includes(v.body));
  }
  if (typeof f.maxPrice === "number") {
    out = out.filter((v) => v.price <= f.maxPrice!);
  }
  if (typeof f.minYear === "number") {
    out = out.filter((v) => v.year >= f.minYear!);
  }

  switch (f.sort) {
    case "menor-preco":
      out.sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      out.sort((a, b) => b.price - a.price);
      break;
    case "mais-novo":
      out.sort((a, b) => b.year - a.year || a.mileage - b.mileage);
      break;
    case "menos-km":
      out.sort((a, b) => a.mileage - b.mileage);
      break;
    default:
      out.sort(
        (a, b) =>
          (a.featuredPosition ?? Infinity) - (b.featuredPosition ?? Infinity) ||
          b.year - a.year,
      );
  }

  return out;
}
