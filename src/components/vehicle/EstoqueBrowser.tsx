"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, X, SlidersHorizontal } from "@phosphor-icons/react/dist/ssr";
import type { Vehicle } from "@/types/vehicle";
import {
  filterVehicles,
  formatPrice,
  type SortKey,
} from "@/lib/vehicle-format";
import { VehicleCard } from "@/components/vehicle/VehicleCard";

const sortLabels: Record<SortKey, string> = {
  relevancia: "Mais relevantes",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  "mais-novo": "Ano mais novo",
  "menos-km": "Menor km",
};

export function EstoqueBrowser({
  vehicles,
  brands,
  bodies,
  priceCeiling,
}: {
  vehicles: Vehicle[];
  brands: string[];
  bodies: Vehicle["body"][];
  priceCeiling: number;
}) {
  const [search, setSearch] = useState("");
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selBodies, setSelBodies] = useState<Vehicle["body"][]>([]);
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(
    () =>
      filterVehicles(vehicles, {
        search,
        brands: selBrands,
        bodies: selBodies,
        maxPrice: maxPrice < priceCeiling ? maxPrice : undefined,
        sort,
      }),
    [vehicles, search, selBrands, selBodies, maxPrice, priceCeiling, sort],
  );

  const activeCount =
    selBrands.length +
    selBodies.length +
    (maxPrice < priceCeiling ? 1 : 0) +
    (search ? 1 : 0);

  function toggle<T>(list: T[], value: T, set: (v: T[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function clearAll() {
    setSearch("");
    setSelBrands([]);
    setSelBodies([]);
    setMaxPrice(priceCeiling);
  }

  const chip = (active: boolean) =>
    `rounded border px-3 py-1.5 text-[0.85rem] transition-colors ${
      active
        ? "border-accent bg-accent/10 text-fg"
        : "border-border-strong text-fg-dim hover:border-fg hover:text-fg"
    }`;

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded border border-border-strong px-3 py-2 text-[0.9rem] text-fg"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeCount > 0 ? (
              <span className="rounded-full bg-accent px-1.5 text-[0.7rem] text-accent-ink">
                {activeCount}
              </span>
            ) : null}
          </button>
        </div>

        <div
          className={`${filtersOpen ? "flex" : "hidden"} mt-4 flex-col gap-7 lg:mt-0 lg:flex`}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="busca" className="text-[0.8rem] text-fg">
              Buscar
            </label>
            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="busca"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Marca ou modelo"
                className="h-11 w-full rounded border border-border-strong bg-bg-elev pl-9 pr-3 text-fg placeholder:text-muted focus-visible:border-accent focus-visible:outline-none"
              />
            </div>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-[0.8rem] text-fg">Marca</legend>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={selBrands.includes(b)}
                  onClick={() => toggle(selBrands, b, setSelBrands)}
                  className={chip(selBrands.includes(b))}
                >
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-[0.8rem] text-fg">Carroceria</legend>
            <div className="flex flex-wrap gap-2">
              {bodies.map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={selBodies.includes(b)}
                  onClick={() => toggle(selBodies, b, setSelBodies)}
                  className={chip(selBodies.includes(b))}
                >
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="preco" className="flex items-center justify-between text-[0.8rem] text-fg">
              Preço até
              <span className="text-fg-dim tnum">{formatPrice(maxPrice)}</span>
            </label>
            <input
              id="preco"
              type="range"
              min={40000}
              max={priceCeiling}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-[var(--accent)]"
            />
          </div>

          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex w-fit items-center gap-1.5 text-[0.85rem] text-fg-dim hover:text-fg"
            >
              <X size={14} />
              Limpar filtros
            </button>
          ) : null}
        </div>
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <p className="text-[0.9rem] text-fg-dim tnum">
            {results.length}{" "}
            {results.length === 1 ? "veículo" : "veículos"}
          </p>
          <label className="flex items-center gap-2 text-[0.85rem] text-fg-dim">
            Ordenar
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded border border-border-strong bg-bg-elev px-2 text-fg focus-visible:border-accent focus-visible:outline-none"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded border border-border bg-surface p-10">
            <p className="font-display text-lg text-fg">
              Nenhum veículo com esses filtros
            </p>
            <p className="text-[0.92rem] text-fg-dim">
              Tente ampliar a faixa de preço ou tirar alguma marca da seleção.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-1 text-[0.9rem] text-accent hover:text-accent-hover"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
