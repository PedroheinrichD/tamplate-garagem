import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { requireUser } from "@/lib/auth";
import { VehicleForm } from "@/components/admin/VehicleForm";

export const dynamic = "force-dynamic";

export default async function NovoVeiculoPage() {
  await requireUser();
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Link
        href="/admin/veiculos"
        className="inline-flex items-center gap-1 text-[0.85rem] text-fg-dim hover:text-fg"
      >
        <CaretLeft size={14} /> Veículos
      </Link>
      <h1 className="font-display text-2xl font-semibold text-fg">
        Novo veículo
      </h1>
      <p className="-mt-3 text-[0.9rem] text-fg-dim">
        Salve o veículo e depois adicione as fotos na tela de edição.
      </p>
      <VehicleForm />
    </div>
  );
}
