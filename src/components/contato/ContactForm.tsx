"use client";

import { useId, useState, type FormEvent } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { whatsappHref } from "@/components/ui/WhatsappCta";
import { submitContactLead } from "@/app/actions/leads";

const subjects = [
  "Quero comprar um carro",
  "Quero vender meu carro",
  "Quero trocar meu carro",
  "Financiamento",
  "Outro assunto",
];

type Field = "nome" | "telefone" | "mensagem";

export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState({
    nome: "",
    telefone: "",
    assunto: subjects[0],
    mensagem: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function update(name: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    setFormError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (values.nome.trim().length < 2) next.nome = "Como podemos te chamar?";
    if (values.telefone.replace(/\D/g, "").length < 10)
      next.telefone = "Informe um WhatsApp com DDD.";
    if (values.mensagem.trim().length < 5)
      next.mensagem = "Escreva uma mensagem rápida para a gente.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    const result = await submitContactLead({
      name: values.nome,
      phone: values.telefone,
      subject: values.assunto,
      message: values.mensagem,
    });
    setSubmitting(false);

    if (!result.ok) {
      const map: Record<string, Field> = {
        name: "nome",
        phone: "telefone",
        message: "mensagem",
      };
      const mapped: Partial<Record<Field, string>> = {};
      for (const [k, v] of Object.entries(result.fieldErrors ?? {})) {
        if (map[k]) mapped[map[k]] = v;
      }
      setErrors(mapped);
      setFormError(result.error);
      return;
    }

    const msg = [
      values.assunto,
      `Nome: ${values.nome}`,
      `WhatsApp: ${values.telefone}`,
      "",
      values.mensagem,
    ].join("\n");
    window.open(whatsappHref(msg, 1), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const inputBase =
    "w-full rounded border border-border-strong bg-bg-elev px-3.5 py-3 text-fg placeholder:text-muted focus-visible:border-accent focus-visible:outline-none";

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4 rounded border border-border bg-surface p-8">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check size={22} weight="bold" />
        </span>
        <h2 className="font-display text-xl font-semibold text-fg">
          Recebemos sua mensagem
        </h2>
        <p className="text-[0.95rem] text-fg-dim">
          Já está registrada e a gente responde em breve. Abrimos o WhatsApp
          também, se preferir adiantar por lá. Se não abriu, fale com a gente em{" "}
          <a
            className="text-accent hover:text-accent-hover"
            href={whatsappHref(undefined, 1)}
            target="_blank"
            rel="noopener noreferrer"
          >
            nosso WhatsApp
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-[0.9rem] text-fg-dim underline underline-offset-4 hover:text-fg"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded border border-border bg-surface p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-nome`} className="text-[0.85rem] text-fg">
            Nome
          </label>
          <input
            id={`${uid}-nome`}
            className={inputBase}
            value={values.nome}
            onChange={(e) => update("nome", e.target.value)}
            aria-invalid={!!errors.nome}
            aria-describedby={errors.nome ? `${uid}-nome-err` : undefined}
            autoComplete="name"
          />
          {errors.nome ? (
            <p id={`${uid}-nome-err`} className="text-[0.8rem] text-accent-hover">
              {errors.nome}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-tel`} className="text-[0.85rem] text-fg">
            WhatsApp com DDD
          </label>
          <input
            id={`${uid}-tel`}
            inputMode="tel"
            className={inputBase}
            value={values.telefone}
            onChange={(e) => update("telefone", e.target.value)}
            aria-invalid={!!errors.telefone}
            aria-describedby={errors.telefone ? `${uid}-tel-err` : undefined}
            autoComplete="tel"
          />
          {errors.telefone ? (
            <p id={`${uid}-tel-err`} className="text-[0.8rem] text-accent-hover">
              {errors.telefone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-assunto`} className="text-[0.85rem] text-fg">
          Assunto
        </label>
        <select
          id={`${uid}-assunto`}
          className={inputBase}
          value={values.assunto}
          onChange={(e) => update("assunto", e.target.value)}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-msg`} className="text-[0.85rem] text-fg">
          Mensagem
        </label>
        <textarea
          id={`${uid}-msg`}
          rows={4}
          className={`${inputBase} resize-y`}
          value={values.mensagem}
          onChange={(e) => update("mensagem", e.target.value)}
          aria-invalid={!!errors.mensagem}
          aria-describedby={errors.mensagem ? `${uid}-msg-err` : undefined}
        />
        {errors.mensagem ? (
          <p id={`${uid}-msg-err`} className="text-[0.8rem] text-accent-hover">
            {errors.mensagem}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" className="text-[0.85rem] text-accent-hover">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center justify-center rounded bg-accent px-6 font-medium text-accent-ink transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:opacity-60"
      >
        {submitting ? "Enviando…" : "Enviar mensagem"}
      </button>
      <p className="text-[0.78rem] text-muted">
        A mensagem é registrada e também abrimos o WhatsApp para você conferir.
      </p>
    </form>
  );
}
