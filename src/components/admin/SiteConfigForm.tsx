"use client";

import { useActionState, useState } from "react";
import { updateSiteConfig, type ConfigFormState } from "@/app/actions/config";

type Values = {
  name: string;
  shortName: string;
  tagline: string;
  soldCount: number;
  yearsActive: number;
  instagramHandle: string;
  instagramUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  addressStreet: string;
  addressDistrict: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  mapsUrl: string;
  hours: { days: string; time: string }[];
};

const initial: ConfigFormState = { ok: false };
const input =
  "h-10 w-full rounded border border-border-strong bg-bg-elev px-3 text-[0.9rem] text-fg focus-visible:border-accent focus-visible:outline-none";

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  errors,
}: {
  name: string;
  label: string;
  defaultValue: string | number;
  type?: string;
  errors: Record<string, string>;
}) {
  return (
    <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} className={input} />
      {errors[name] ? (
        <span className="text-[0.75rem] text-accent-hover">{errors[name]}</span>
      ) : null}
    </label>
  );
}

export function SiteConfigForm({ values }: { values: Values }) {
  const [state, action, pending] = useActionState(updateSiteConfig, initial);
  const [hours, setHours] = useState(
    values.hours.length ? values.hours : [{ days: "", time: "" }],
  );
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-8">
      <input type="hidden" name="hours" value={JSON.stringify(hours)} />

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Marca
        </legend>
        <Field errors={fe} name="name" label="Nome" defaultValue={values.name} />
        <Field errors={fe} name="shortName" label="Nome curto" defaultValue={values.shortName} />
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim sm:col-span-2">
          Tagline
          <input name="tagline" defaultValue={values.tagline} className={input} />
        </label>
        <Field errors={fe} name="soldCount" label="Carros vendidos" defaultValue={values.soldCount} type="number" />
        <Field errors={fe} name="yearsActive" label="Anos de loja" defaultValue={values.yearsActive} type="number" />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Contato
        </legend>
        <Field errors={fe} name="whatsappNumber" label="WhatsApp (DDI+DDD+número, só dígitos)" defaultValue={values.whatsappNumber} />
        <Field errors={fe} name="email" label="E-mail" defaultValue={values.email} type="email" />
        <label className="flex flex-col gap-1 text-[0.82rem] text-fg-dim sm:col-span-2">
          Mensagem padrão do WhatsApp
          <input name="whatsappMessage" defaultValue={values.whatsappMessage} className={input} />
        </label>
        <Field errors={fe} name="instagramHandle" label="Instagram (@)" defaultValue={values.instagramHandle} />
        <Field errors={fe} name="instagramUrl" label="Instagram (URL)" defaultValue={values.instagramUrl} />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Endereço
        </legend>
        <Field errors={fe} name="addressStreet" label="Rua e número" defaultValue={values.addressStreet} />
        <Field errors={fe} name="addressDistrict" label="Bairro" defaultValue={values.addressDistrict} />
        <Field errors={fe} name="addressCity" label="Cidade" defaultValue={values.addressCity} />
        <Field errors={fe} name="addressState" label="UF" defaultValue={values.addressState} />
        <Field errors={fe} name="addressZip" label="CEP" defaultValue={values.addressZip} />
        <Field errors={fe} name="mapsUrl" label="Link do Google Maps" defaultValue={values.mapsUrl} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-sm font-semibold text-fg">
          Horário
        </legend>
        {hours.map((h, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <input
              className={`${input} max-w-[220px]`}
              placeholder="Segunda a sexta"
              value={h.days}
              onChange={(e) =>
                setHours((hs) => hs.map((x, j) => (j === i ? { ...x, days: e.target.value } : x)))
              }
            />
            <input
              className={`${input} max-w-[200px]`}
              placeholder="08h30 às 18h30"
              value={h.time}
              onChange={(e) =>
                setHours((hs) => hs.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))
              }
            />
            <button
              type="button"
              onClick={() => setHours((hs) => hs.filter((_, j) => j !== i))}
              className="text-[0.8rem] text-accent-hover hover:underline"
            >
              remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setHours((hs) => [...hs, { days: "", time: "" }])}
          className="w-fit text-[0.82rem] text-fg-dim underline underline-offset-4 hover:text-fg"
        >
          + adicionar linha
        </button>
      </fieldset>

      {state.error ? (
        <p role="alert" className="text-[0.88rem] text-accent-hover">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-[0.88rem] text-accent">Configuração salva.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-fit items-center justify-center rounded bg-accent px-6 font-medium text-accent-ink hover:bg-accent-hover active:translate-y-px disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar configuração"}
      </button>
    </form>
  );
}
