import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarBlank,
  Gauge,
  Tag,
  Image as ImageIcon,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { requireUser } from "@/lib/auth";
import { getVehiclesForAdmin } from "@/lib/admin";
import { formatPrice, formatMileage } from "@/lib/vehicle-format";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  RESERVED: "Reservado",
  SOLD: "Vendido",
};

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABEL[status] ?? status;
  if (status === "AVAILABLE") {
    return (
      <span className="rounded border border-border-strong px-2 py-1 text-[0.72rem] text-fg-dim">
        {label}
      </span>
    );
  }
  return (
    <span className="rounded bg-accent px-2 py-1 text-[0.72rem] font-medium text-accent-ink">
      {label}
    </span>
  );
}

function InfoItem({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted">{icon}</span>
      <div className="leading-tight">
        <p className="tnum text-fg">{value}</p>
        <p className="text-[0.7rem] text-muted">{label}</p>
      </div>
    </div>
  );
}

export default async function AdminVehiclesPage() {
  await requireUser();
  const vehicles = await getVehiclesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">
            Veículos
          </h1>
          <p className="mt-1 text-[0.9rem] text-fg-dim">
            {vehicles.length} no estoque. Placa/RENAVAM/custo são internos — só
            aparecem aqui.
          </p>
        </div>
        <Link
          href="/admin/veiculos/novo"
          className="inline-flex h-10 items-center justify-center rounded bg-accent px-4 text-[0.88rem] font-medium text-accent-ink hover:bg-accent-hover"
        >
          Novo veículo
        </Link>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {vehicles.map((v) => (
          <li
            key={v.id}
            className="overflow-hidden rounded border border-border bg-surface"
          >
            <Link
              href={`/admin/veiculos/${v.id}`}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-fg">
                  {v.brand} {v.model}
                </p>
                <p className="truncate text-[0.8rem] text-muted">
                  {v.version}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={v.status} />
                <CaretRight
                  size={16}
                  weight="bold"
                  className="text-muted"
                  aria-hidden
                />
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border px-4 py-3 text-[0.85rem]">
              <InfoItem
                icon={<CalendarBlank size={18} weight="light" aria-hidden />}
                value={v.year}
                label="Ano"
              />
              <InfoItem
                icon={<Gauge size={18} weight="light" aria-hidden />}
                value={formatMileage(v.mileage)}
                label="Km"
              />
              <InfoItem
                icon={<Tag size={18} weight="light" aria-hidden />}
                value={formatPrice(v.price)}
                label="Preço"
              />
              <InfoItem
                icon={<ImageIcon size={18} weight="light" aria-hidden />}
                value={v._count.photos}
                label="Fotos"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded border border-border md:block">
        <table className="w-full min-w-[860px] text-left text-[0.85rem]">
          <thead className="bg-bg-elev text-muted">
            <tr>
              <th className="p-3 font-medium">Veículo</th>
              <th className="p-3 font-medium">Ano</th>
              <th className="p-3 font-medium">Km</th>
              <th className="p-3 font-medium">Preço</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Fotos</th>
              <th className="p-3 font-medium">Placa</th>
              <th className="p-3 font-medium">Custo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((v) => (
              <tr key={v.id} className="text-fg-dim">
                <td className="p-3">
                  <Link
                    href={`/admin/veiculos/${v.id}`}
                    className="text-fg hover:text-accent"
                  >
                    {v.brand} {v.model}
                  </Link>
                  <span className="block text-[0.78rem] text-muted">
                    {v.version}
                  </span>
                </td>
                <td className="p-3 tnum">{v.year}</td>
                <td className="whitespace-nowrap p-3 tnum">
                  {formatMileage(v.mileage)}
                </td>
                <td className="whitespace-nowrap p-3 tnum">
                  {formatPrice(v.price)}
                </td>
                <td className="p-3">{STATUS_LABEL[v.status] ?? v.status}</td>
                <td className="p-3 tnum">{v._count.photos}</td>
                <td className="p-3">{v.licensePlate ?? "—"}</td>
                <td className="whitespace-nowrap p-3 tnum">
                  {v.purchaseCost ? formatPrice(v.purchaseCost) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
