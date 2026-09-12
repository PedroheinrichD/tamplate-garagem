"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { X } from "@phosphor-icons/react/dist/ssr";
import { setFeaturedPosition, clearFeaturedPosition } from "@/app/actions/vehicles";

type PickerVehicle = {
  id: string;
  name: string;
  version: string;
  status: string;
  featuredPosition: number | null;
  coverUrl: string | null;
  coverAlt: string | null;
};

const POSITIONS = [1, 2, 3] as const;
type Position = (typeof POSITIONS)[number];

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  RESERVED: "Reservado",
  SOLD: "Vendido",
};

function Thumb({ url, alt, size }: { url: string | null; alt: string | null; size: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded bg-surface-2"
      style={{ width: size, height: size }}
    >
      {url ? (
        <Image src={url} alt={alt ?? ""} fill sizes={`${size}px`} className="object-cover" />
      ) : null}
    </div>
  );
}

export function DestaquesManager({ vehicles }: { vehicles: PickerVehicle[] }) {
  const [pending, start] = useTransition();
  const [openPosition, setOpenPosition] = useState<Position | null>(null);

  const pickable = vehicles.filter((v) => v.status === "AVAILABLE");

  function pick(position: Position, vehicleId: string) {
    start(async () => {
      await setFeaturedPosition(position, vehicleId);
      setOpenPosition(null);
    });
  }

  function remove(position: Position) {
    start(() => clearFeaturedPosition(position));
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {POSITIONS.map((position) => {
        const vehicle = vehicles.find((v) => v.featuredPosition === position);
        const open = openPosition === position;

        return (
          <div
            key={position}
            className="flex flex-col gap-3 rounded border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.78rem] text-muted">Posição {position}</span>
              {position === 1 ? (
                <span className="text-[0.72rem] text-accent">Destaque principal</span>
              ) : null}
            </div>

            {vehicle ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Thumb url={vehicle.coverUrl} alt={vehicle.coverAlt} size={56} />
                  <div className="min-w-0">
                    <p className="truncate text-[0.9rem] font-medium text-fg">
                      {vehicle.name}
                    </p>
                    <p className="truncate text-[0.78rem] text-muted">{vehicle.version}</p>
                  </div>
                </div>
                {vehicle.status !== "AVAILABLE" ? (
                  <p className="text-[0.78rem] text-accent-hover">
                    {STATUS_LABEL[vehicle.status] ?? vehicle.status}: não aparece na home
                    enquanto não estiver disponível.
                  </p>
                ) : null}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setOpenPosition(open ? null : position)}
                    className="rounded border border-border-strong px-3 py-1.5 text-[0.8rem] text-fg-dim hover:border-fg hover:text-fg disabled:opacity-50"
                  >
                    Trocar
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => remove(position)}
                    className="rounded border border-border-strong px-3 py-1.5 text-[0.8rem] text-accent-hover hover:bg-accent/10 disabled:opacity-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpenPosition(open ? null : position)}
                className="flex h-24 items-center justify-center rounded border border-dashed border-border-strong text-[0.85rem] text-fg-dim hover:border-fg hover:text-fg disabled:opacity-50"
              >
                Escolher veículo
              </button>
            )}

            {open ? (
              <div className="flex flex-col gap-2 rounded border border-border bg-bg-elev p-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[0.78rem] text-muted">Veículos disponíveis</span>
                  <button
                    type="button"
                    onClick={() => setOpenPosition(null)}
                    aria-label="Fechar"
                    className="text-fg-dim hover:text-fg"
                  >
                    <X size={14} />
                  </button>
                </div>
                {pickable.length === 0 ? (
                  <p className="p-2 text-[0.82rem] text-fg-dim">
                    Nenhum veículo disponível.
                  </p>
                ) : (
                  <ul className="flex max-h-64 flex-col divide-y divide-border overflow-y-auto">
                    {pickable.map((v) => (
                      <li key={v.id}>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => pick(position, v.id)}
                          className="flex w-full items-center gap-3 p-2 text-left hover:bg-white/[0.04] disabled:opacity-50"
                        >
                          <Thumb url={v.coverUrl} alt={v.coverAlt} size={40} />
                          <div className="min-w-0">
                            <p className="truncate text-[0.85rem] text-fg">{v.name}</p>
                            <p className="truncate text-[0.75rem] text-muted">
                              {v.version}
                            </p>
                          </div>
                          {v.featuredPosition ? (
                            <span className="ml-auto shrink-0 text-[0.72rem] text-accent">
                              nº {v.featuredPosition}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
