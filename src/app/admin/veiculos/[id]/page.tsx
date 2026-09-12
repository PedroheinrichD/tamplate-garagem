import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretLeft, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { requireUser } from "@/lib/auth";
import { getVehicleForAdmin } from "@/lib/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/config";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { DeleteVehicleButton } from "@/components/admin/DeleteVehicleButton";

export const dynamic = "force-dynamic";

export default async function EditarVeiculoPage({
  params,
}: PageProps<"/admin/veiculos/[id]">) {
  await requireUser();
  const { id } = await params;
  const vehicle = await getVehicleForAdmin(id);
  if (!vehicle) notFound();

  const storageOn = isServiceRoleConfigured();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/admin/veiculos"
            className="inline-flex items-center gap-1 text-[0.85rem] text-fg-dim hover:text-fg"
          >
            <CaretLeft size={14} /> Veículos
          </Link>
          <h1 className="font-display text-2xl font-semibold text-fg">
            {vehicle.brand} {vehicle.model}
          </h1>
        </div>
        <Link
          href={`/estoque/${vehicle.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-[0.85rem] text-fg-dim hover:text-fg"
        >
          Ver no site <ArrowSquareOut size={14} />
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="max-w-2xl">
          <VehicleForm vehicle={vehicle} />
        </div>

        <div className="flex flex-col gap-8">
          {storageOn ? (
            <PhotoManager vehicleId={vehicle.id} photos={vehicle.photos} />
          ) : (
            <div className="rounded border border-border bg-surface p-4 text-[0.85rem] text-fg-dim">
              Upload de fotos indisponível: configure{" "}
              <code className="text-fg">SUPABASE_SERVICE_ROLE_KEY</code> no{" "}
              <code className="text-fg">.env</code>. As fotos atuais (
              {vehicle.photos.length}) continuam valendo.
            </div>
          )}

          <div className="border-t border-border pt-6">
            <DeleteVehicleButton
              id={vehicle.id}
              name={`${vehicle.brand} ${vehicle.model}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
