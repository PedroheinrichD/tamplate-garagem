"use client";

import { useId, useState, type FormEvent } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { submitInterestLead } from "@/app/actions/leads";

type Field = "nome" | "telefone";

/**
 * Captura de interesse num veículo específico. Cria um lead kind=INTERESSE
 * já associado ao vehicleId (resolvido pelo slug no servidor).
 */
export function VehicleInterestForm({ vehicleSlug }: { vehicleSlug: string }) {
  const uid = useId();
  const [values, setValues] = useState({ nome: "", telefone: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function update(name: Field, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    setFormError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (values.nome.trim().length < 2) next.nome = "Informe seu nome.";
    if (values.telefone.replace(/\D/g, "").length < 10)
      next.telefone = "WhatsApp com DDD.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    const result = await submitInterestLead({
      name: values.nome,
      phone: values.telefone,
      vehicleSlug,
    });
    setSubmitting(false);

    if (!result.ok) {
      const map: Record<string, Field> = { name: "nome", phone: "telefone" };
      const mapped: Partial<Record<Field, string>> = {};
      for (const [k, v] of Object.entries(result.fieldErrors ?? {})) {
        if (map[k]) mapped[map[k]] = v;
      }
      setErrors(mapped);
      setFormError(result.error);
      return;
    }
    setSent(true);
  }

  const inputBase =
    "h-11 w-full rounded border border-border-strong bg-bg-elev px-3 text-[0.9rem] text-fg placeholder:text-muted focus-visible:border-accent focus-visible:outline-none";

  if (sent) {
    return (
      <div className="flex items-start gap-2 rounded border border-border bg-bg-elev p-4 text-[0.88rem] text-fg-dim">
        <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" />
        Recebemos seu contato. A equipe retorna sobre este veículo em breve.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2.5">
      <p className="text-[0.8rem] text-muted">Prefere que a gente entre em contato?</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${uid}-n`} className="sr-only">
            Seu nome
          </label>
          <input
            id={`${uid}-n`}
            className={inputBase}
            placeholder="Seu nome"
            value={values.nome}
            onChange={(e) => update("nome", e.target.value)}
            aria-invalid={!!errors.nome}
            autoComplete="name"
          />
          {errors.nome ? (
            <span className="text-[0.75rem] text-accent-hover">{errors.nome}</span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${uid}-t`} className="sr-only">
            WhatsApp com DDD
          </label>
          <input
            id={`${uid}-t`}
            inputMode="tel"
            className={inputBase}
            placeholder="WhatsApp com DDD"
            value={values.telefone}
            onChange={(e) => update("telefone", e.target.value)}
            aria-invalid={!!errors.telefone}
            autoComplete="tel"
          />
          {errors.telefone ? (
            <span className="text-[0.75rem] text-accent-hover">
              {errors.telefone}
            </span>
          ) : null}
        </div>
      </div>
      {formError ? (
        <p role="alert" className="text-[0.8rem] text-accent-hover">
          {formError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 items-center justify-center rounded border border-border-strong px-4 text-[0.9rem] font-medium text-fg transition-colors duration-200 hover:border-fg hover:bg-white/[0.04] active:translate-y-px disabled:opacity-60"
      >
        {submitting ? "Enviando…" : "Quero que me chamem"}
      </button>
    </form>
  );
}
