"use client";

import { useState, startTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  saveVehicle,
  uploadVehiclePhotos,
  type VehicleFormState,
} from "@/app/actions/vehicles";
import {
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  BODY_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/vehicle-schema";
import { PhotoPicker } from "@/components/admin/PhotoPicker";

type VehicleLike = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  manufactureYear: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  body: string;
  color: string;
  doors: number;
  plateEnd: number;
  status: string;
  highlights: string[];
  features: string[];
  description: string;
  licensePlate: string | null;
  renavam: string | null;
  chassis: string | null;
  fipeCode: string | null;
  purchaseCost: number | null;
  internalNotes: string | null;
};

const initial: VehicleFormState = { ok: false };

const input =
  "h-10 w-full rounded border border-border-strong bg-bg-elev px-3 text-[0.9rem] text-fg focus-visible:border-accent focus-visible:outline-none";
const area = `${input} h-auto min-h-24 py-2 leading-relaxed`;

function FieldError({
  errors,
  name,
}: {
  errors: Record<string, string>;
  name: string;
}) {
  return errors[name] ? (
    <span className="text-[0.75rem] text-accent-hover">{errors[name]}</span>
  ) : null;
}

export function VehicleForm({ vehicle }: { vehicle?: VehicleLike }) {
  const router = useRouter();
  const editing = Boolean(vehicle);

  const [state, setState] = useState<VehicleFormState>(initial);
  const fe = state.fieldErrors ?? {};
  const [phase, setPhase] = useState<"idle" | "saving" | "uploading">("idle");
  const pending = phase !== "idle";

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Envio manual (sem <form action={fn}>: o React 19 chamaria form.reset()
  // sempre que a action terminasse, inclusive em erro de validação). Salva o
  // veículo e, se for criação com fotos escolhidas, sobe as fotos antes de
  // navegar - tudo em sequência aqui, sem precisar de efeito pra reagir ao
  // resultado da action.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPhotoError(null);
    setPhase("saving");
    startTransition(async () => {
      const result = await saveVehicle(state, data);
      setState(result);

      if (!editing && result.ok && result.id) {
        const id = result.id;
        if (photos.length > 0) {
          setPhase("uploading");
          const fd = new FormData();
          photos.forEach((f) => fd.append("files", f));
          const res = await uploadVehiclePhotos(id, fd);
          if (!res.ok) {
            setPhotoError(
              res.error ??
                "O veículo foi criado, mas as fotos não subiram. Tente de novo abaixo ou na tela de edição.",
            );
            setPhase("idle");
            return;
          }
        }
        router.push(`/admin/veiculos/${id}`);
        return;
      }
      setPhase("idle");
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      {vehicle ? <input type="hidden" name="id" value={vehicle.id} /> : null}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Identificação
        </legend>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Slug (URL)
          <input
            name="slug"
            defaultValue={vehicle?.slug}
            placeholder="marca-modelo-versao-ano"
            className={input}
            required
          />
          <FieldError errors={fe} name="slug" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Marca
          <input name="brand" defaultValue={vehicle?.brand} className={input} required />
          <FieldError errors={fe} name="brand" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Modelo
          <input name="model" defaultValue={vehicle?.model} className={input} required />
          <FieldError errors={fe} name="model" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Versão
          <input name="version" defaultValue={vehicle?.version} className={input} required />
          <FieldError errors={fe} name="version" />
        </label>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Especificações
        </legend>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Ano modelo
          <input name="year" type="number" defaultValue={vehicle?.year} className={input} required />
          <FieldError errors={fe} name="year" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Ano fabricação
          <input
            name="manufactureYear"
            type="number"
            defaultValue={vehicle?.manufactureYear}
            className={input}
            required
          />
          <FieldError errors={fe} name="manufactureYear" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Preço (R$ inteiros)
          <input name="price" type="number" defaultValue={vehicle?.price} className={input} required />
          <FieldError errors={fe} name="price" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Quilometragem
          <input name="mileage" type="number" defaultValue={vehicle?.mileage} className={input} required />
          <FieldError errors={fe} name="mileage" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Combustível
          <select name="fuel" defaultValue={vehicle?.fuel ?? "FLEX"} className={input}>
            {FUEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Câmbio
          <select name="transmission" defaultValue={vehicle?.transmission ?? "MANUAL"} className={input}>
            {TRANSMISSION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Carroceria
          <select name="body" defaultValue={vehicle?.body ?? "HATCH"} className={input}>
            {BODY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Cor
          <input name="color" defaultValue={vehicle?.color} className={input} required />
          <FieldError errors={fe} name="color" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Portas
          <input name="doors" type="number" min={2} max={6} defaultValue={vehicle?.doors ?? 4} className={input} />
          <FieldError errors={fe} name="doors" />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Final de placa
          <input name="plateEnd" type="number" min={0} max={9} defaultValue={vehicle?.plateEnd ?? 0} className={input} />
          <FieldError errors={fe} name="plateEnd" />
        </label>
      </fieldset>

      <fieldset className="flex flex-wrap items-center gap-6">
        <legend className="mb-2 w-full font-display text-sm font-semibold text-fg">
          Situação
        </legend>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Status
          <select name="status" defaultValue={vehicle?.status ?? "AVAILABLE"} className={input}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Conteúdo
        </legend>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Destaques (um por linha)
          <textarea
            name="highlights"
            defaultValue={vehicle?.highlights.join("\n")}
            className={area}
            rows={3}
          />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Equipamentos (um por linha)
          <textarea
            name="features"
            defaultValue={vehicle?.features.join("\n")}
            className={area}
            rows={6}
          />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Descrição
          <textarea
            name="description"
            defaultValue={vehicle?.description}
            className={area}
            rows={4}
            required
          />
          <FieldError errors={fe} name="description" />
        </label>
      </fieldset>

      <fieldset className="grid gap-4 rounded border border-border-strong bg-bg-elev/40 p-4 sm:grid-cols-3">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Interno (opcional, não aparece no site)
        </legend>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Placa
          <input name="licensePlate" defaultValue={vehicle?.licensePlate ?? ""} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          RENAVAM
          <input name="renavam" defaultValue={vehicle?.renavam ?? ""} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Chassi
          <input name="chassis" defaultValue={vehicle?.chassis ?? ""} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Código FIPE
          <input name="fipeCode" defaultValue={vehicle?.fipeCode ?? ""} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
          Custo de compra
          <input name="purchaseCost" type="number" defaultValue={vehicle?.purchaseCost ?? ""} className={input} />
        </label>
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim sm:col-span-3">
          Observações internas
          <textarea name="internalNotes" defaultValue={vehicle?.internalNotes ?? ""} className={area} rows={2} />
        </label>
      </fieldset>

      {!editing ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 font-display text-sm font-semibold text-fg">
            Fotos
          </legend>
          <PhotoPicker files={photos} onChange={setPhotos} disabled={pending} />
          <p className="text-[0.78rem] text-muted">
            As fotos são enviadas assim que o veículo for criado.
          </p>
        </fieldset>
      ) : null}

      {state.error ? (
        <p role="alert" className="text-[0.88rem] text-accent-hover">
          {state.error}
        </p>
      ) : null}
      {state.ok && editing ? (
        <p className="text-[0.88rem] text-accent">Alterações salvas.</p>
      ) : null}
      {photoError ? (
        <div className="flex flex-col gap-2 rounded border border-accent/30 bg-accent/5 p-3 text-[0.85rem] text-accent-hover">
          <p role="alert">{photoError}</p>
          {state.id ? (
            <Link
              href={`/admin/veiculos/${state.id}`}
              className="w-fit underline underline-offset-2"
            >
              Ir para o veículo criado
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded bg-accent px-6 font-medium text-accent-ink hover:bg-accent-hover active:translate-y-px disabled:opacity-60"
        >
          {phase === "saving"
            ? "Salvando…"
            : phase === "uploading"
              ? "Enviando fotos…"
              : editing
                ? "Salvar alterações"
                : "Criar veículo"}
        </button>
      </div>
    </form>
  );
}
