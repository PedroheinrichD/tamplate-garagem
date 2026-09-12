"use client";

import { useTransition } from "react";
import { deleteVehicle } from "@/app/actions/vehicles";

export function DeleteVehicleButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Excluir "${name}"? As fotos também serão apagadas.`)) {
          start(() => deleteVehicle(id));
        }
      }}
      className="inline-flex h-11 items-center justify-center rounded border border-accent-hover/50 px-5 text-[0.9rem] font-medium text-accent-hover hover:bg-accent/10 disabled:opacity-60"
    >
      {pending ? "Excluindo…" : "Excluir veículo"}
    </button>
  );
}
