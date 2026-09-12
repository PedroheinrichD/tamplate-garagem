import Link from "next/link";
import {
  GasPump,
  Gauge,
  CalendarBlank,
} from "@phosphor-icons/react/dist/ssr";
import type { Vehicle } from "@/types/vehicle";
import {
  formatMileage,
  formatPrice,
  formatYear,
} from "@/lib/vehicle-format";
import { VehicleImage } from "@/components/vehicle/VehicleImage";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/estoque/${vehicle.id}`}
      className="group flex flex-col overflow-hidden rounded border border-border bg-surface transition-colors duration-300 hover:border-border-strong"
    >
      <div className="relative overflow-hidden">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.03]">
          <VehicleImage
            photo={vehicle.photos[0]}
            label={`${vehicle.brand} ${vehicle.model}`}
            ratio="4 / 3"
            className="rounded-none border-0"
          />
        </div>
        <span className="absolute left-3 top-3 rounded bg-bg/80 px-2 py-1 text-[0.7rem] text-fg-dim backdrop-blur-sm">
          {vehicle.body}
        </span>
        {vehicle.status !== "disponivel" ? (
          <span className="absolute right-3 top-3 rounded bg-accent px-2 py-1 text-[0.7rem] font-medium text-accent-ink">
            {vehicle.status === "reservado" ? "Reservado" : "Vendido"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-semibold leading-tight text-fg">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="line-clamp-1 text-[0.85rem] text-muted">
            {vehicle.version}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8rem] text-fg-dim">
          <li className="flex items-center gap-1.5">
            <CalendarBlank size={15} weight="light" aria-hidden />
            <span className="tnum">{formatYear(vehicle)}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Gauge size={15} weight="light" aria-hidden />
            <span className="tnum">{formatMileage(vehicle.mileage)}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <GasPump size={15} weight="light" aria-hidden />
            {vehicle.fuel}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-[0.7rem] text-muted">à vista</span>
            <span className="font-display text-xl font-semibold text-fg tnum">
              {formatPrice(vehicle.price)}
            </span>
          </div>
          <span className="text-[0.85rem] text-accent transition-colors group-hover:text-accent-hover">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
}
