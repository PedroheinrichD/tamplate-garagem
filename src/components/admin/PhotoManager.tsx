"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import {
  uploadVehiclePhotos,
  removeVehiclePhoto,
  moveVehiclePhoto,
} from "@/app/actions/vehicles";
import { PhotoPicker } from "@/components/admin/PhotoPicker";

type Photo = { id: string; url: string; alt: string | null; position: number };

export function PhotoManager({
  vehicleId,
  photos,
}: {
  vehicleId: string;
  photos: Photo[];
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [staged, setStaged] = useState<File[]>([]);

  function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (staged.length === 0) return;
    setMsg(null);
    const fd = new FormData();
    staged.forEach((f) => fd.append("files", f));
    start(async () => {
      const res = await uploadVehiclePhotos(vehicleId, fd);
      if (!res.ok) setMsg(res.error ?? "Falha no upload.");
      else {
        setMsg(`${res.added} foto(s) enviada(s).`);
        setStaged([]);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-fg">
          Fotos ({photos.length})
        </h2>
        <span className="text-[0.78rem] text-muted">
          A primeira é a capa. Ordene com as setas.
        </span>
      </div>

      {photos.length === 0 ? (
        <p className="rounded border border-border bg-surface p-4 text-[0.85rem] text-fg-dim">
          Nenhuma foto. Envie as fotos reais do veículo abaixo.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded border border-border">
          {photos.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded bg-surface-2">
                <Image src={p.url} alt={p.alt ?? ""} fill sizes="64px" className="object-cover" />
              </div>
              <span className="text-[0.8rem] text-muted tnum">
                {i === 0 ? "capa" : `#${i + 1}`}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  disabled={pending || i === 0}
                  onClick={() => start(() => moveVehiclePhoto(p.id, "up"))}
                  aria-label="Subir"
                  className="rounded border border-border-strong p-1.5 text-fg-dim hover:text-fg disabled:opacity-40"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={pending || i === photos.length - 1}
                  onClick={() => start(() => moveVehiclePhoto(p.id, "down"))}
                  aria-label="Descer"
                  className="rounded border border-border-strong p-1.5 text-fg-dim hover:text-fg disabled:opacity-40"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    if (confirm("Remover esta foto?")) {
                      start(() => removeVehiclePhoto(p.id));
                    }
                  }}
                  aria-label="Remover"
                  className="rounded border border-border-strong p-1.5 text-accent-hover hover:bg-accent/10 disabled:opacity-40"
                >
                  <Trash size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onUpload} className="flex flex-col gap-3 rounded border border-border bg-surface p-4">
        <span className="text-[0.82rem] text-fg-dim">
          Adicionar fotos (JPG, PNG, WebP ou AVIF)
        </span>
        <PhotoPicker files={staged} onChange={setStaged} disabled={pending} />
        <button
          type="submit"
          disabled={pending || staged.length === 0}
          className="inline-flex h-10 w-fit items-center gap-2 rounded border border-border-strong px-4 text-[0.88rem] font-medium text-fg hover:border-fg disabled:opacity-60"
        >
          <UploadSimple size={16} />
          {pending ? "Enviando…" : `Enviar${staged.length ? ` (${staged.length})` : ""}`}
        </button>
        {msg ? <p className="text-[0.82rem] text-fg-dim">{msg}</p> : null}
      </form>
    </div>
  );
}
