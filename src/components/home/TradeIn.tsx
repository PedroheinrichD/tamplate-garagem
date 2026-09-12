"use client";

import { useId, useState, type FormEvent } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { whatsappHref } from "@/components/ui/WhatsappCta";
import { submitTradeLead } from "@/app/actions/leads";

type Field = "nome" | "telefone" | "carro";

export function TradeIn() {
  const uid = useId();
  const [values, setValues] = useState({
    nome: "",
    telefone: "",
    carro: "",
    km: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function update(name: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (name in errors) setErrors((e) => ({ ...e, [name]: undefined }));
    setFormError(null);
  }

  function validate() {
    const next: Partial<Record<Field, string>> = {};
    if (values.nome.trim().length < 2) next.nome = "Diga como podemos te chamar.";
    const digits = values.telefone.replace(/\D/g, "");
    if (digits.length < 10)
      next.telefone = "Informe um número com DDD, ex.: (11) 99999-9999.";
    if (values.carro.trim().length < 3)
      next.carro = "Qual carro você quer dar na troca?";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);
    const result = await submitTradeLead({
      name: values.nome,
      phone: values.telefone,
      car: values.carro,
      km: values.km,
    });
    setSubmitting(false);

    if (!result.ok) {
      const map: Record<string, Field> = {
        name: "nome",
        phone: "telefone",
        car: "carro",
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
      "Olá! Quero avaliar meu carro para troca.",
      `Nome: ${values.nome}`,
      `WhatsApp: ${values.telefone}`,
      `Carro atual: ${values.carro}`,
      values.km ? `Km aproximada: ${values.km}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappHref(msg, 1), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const inputBase =
    "h-12 w-full rounded border border-border-strong bg-bg-elev px-3.5 text-fg placeholder:text-muted focus-visible:border-accent focus-visible:outline-none";

  return (
    <section id="troca" className="scroll-mt-24 bg-bg-elev py-16 md:py-24">
      <Container width="wide">
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SplitLines
              lines={["Seu usado", "vale entrada."]}
              className="text-[clamp(1.6rem,6vw,3rem)] font-semibold text-fg"
            />
            <Reveal variant="fade-up">
              <p className="max-w-md text-[1.05rem] leading-relaxed text-fg-dim">
                Manda os dados do seu carro atual. A gente responde no WhatsApp
                com uma faixa de avaliação e já agenda a vistoria presencial.
              </p>
            </Reveal>
            <Reveal variant="fade-up">
              <ul className="flex flex-col gap-3 text-[0.95rem] text-fg-dim">
                {[
                  "Avaliação presencial em cerca de 20 minutos",
                  "O valor abate direto na proposta do próximo carro",
                  "Sem obrigação de fechar negócio",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <Check size={16} weight="bold" className="shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal variant="scale">
            {sent ? (
              <div className="flex h-full flex-col items-start justify-center gap-4 rounded border border-border bg-surface p-8">
                <span className="flex size-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={22} weight="bold" />
                </span>
                <h3 className="font-display text-xl font-semibold text-fg">
                  Pedido de avaliação registrado
                </h3>
                <p className="text-[0.95rem] text-fg-dim">
                  A gente retorna com uma faixa de valor. Abrimos o WhatsApp
                  também, se quiser adiantar. Se o app não abriu, chame em {" "}
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
                  Enviar outro carro
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-5 rounded border border-border bg-surface p-8"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-nome`} className="text-[0.85rem] text-fg">
                    Seu nome
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
                    aria-describedby={
                      errors.telefone ? `${uid}-tel-err` : undefined
                    }
                    autoComplete="tel"
                  />
                  {errors.telefone ? (
                    <p id={`${uid}-tel-err`} className="text-[0.8rem] text-accent-hover">
                      {errors.telefone}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-carro`} className="text-[0.85rem] text-fg">
                    Seu carro atual
                  </label>
                  <input
                    id={`${uid}-carro`}
                    className={inputBase}
                    placeholder="Ex.: Onix 1.0 2019, 60 mil km"
                    value={values.carro}
                    onChange={(e) => update("carro", e.target.value)}
                    aria-invalid={!!errors.carro}
                    aria-describedby={
                      errors.carro ? `${uid}-carro-err` : `${uid}-carro-help`
                    }
                  />
                  {errors.carro ? (
                    <p id={`${uid}-carro-err`} className="text-[0.8rem] text-accent-hover">
                      {errors.carro}
                    </p>
                  ) : (
                    <p id={`${uid}-carro-help`} className="text-[0.8rem] text-muted">
                      Marca, modelo, ano e uma ideia da quilometragem.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-km`} className="text-[0.85rem] text-fg">
                    Quilometragem aproximada
                    <span className="ml-1 text-muted">(opcional)</span>
                  </label>
                  <input
                    id={`${uid}-km`}
                    inputMode="numeric"
                    className={inputBase}
                    value={values.km}
                    onChange={(e) => update("km", e.target.value)}
                  />
                </div>

                {formError ? (
                  <p role="alert" className="text-[0.85rem] text-accent-hover">
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 inline-flex h-12 items-center justify-center rounded bg-accent px-6 font-medium text-accent-ink transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:opacity-60"
                >
                  {submitting ? "Enviando…" : "Pedir avaliação"}
                </button>
                <p className="text-[0.78rem] text-muted">
                  O pedido é registrado e também abrimos o WhatsApp para você
                  conferir.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
