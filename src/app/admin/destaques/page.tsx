import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getVehiclesForFeaturedPicker } from "@/lib/admin";
import { DestaquesManager } from "@/components/admin/DestaquesManager";

export const metadata: Metadata = { title: "Destaques" };
export const dynamic = "force-dynamic";

export default async function AdminDestaquesPage() {
  await requireUser();
  const vehicles = await getVehiclesForFeaturedPicker();

  const items = vehicles.map((v) => ({
    id: v.id,
    name: `${v.brand} ${v.model}`,
    version: v.version,
    status: v.status,
    featuredPosition: v.featuredPosition,
    coverUrl: v.photos[0]?.url ?? null,
    coverAlt: v.photos[0]?.alt ?? null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">
          Destaques
        </h1>
        <p className="mt-1 text-[0.9rem] text-fg-dim">
          Escolha até 3 veículos para a seção &ldquo;Destaques do
          estoque&rdquo; da home, na ordem das posições abaixo. A posição 1
          vira o card grande.
        </p>
      </div>

      <DestaquesManager vehicles={items} />
    </div>
  );
}
