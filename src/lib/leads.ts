import "server-only";

import { z } from "zod";
import { prisma } from "@/lib/db";

/**
 * Persistência de leads (formulários do site). SÓ servidor.
 * Leads são dados administrativos: não existe leitura pública deles.
 */

const name = z
  .string({ error: "Informe seu nome." })
  .trim()
  .min(2, "Informe seu nome.")
  .max(120, "Nome muito longo.");

const phone = z
  .string({ error: "Informe um WhatsApp com DDD." })
  .trim()
  .min(8, "Informe um WhatsApp com DDD.")
  .max(40)
  .refine(
    (v) => v.replace(/\D/g, "").length >= 10,
    "WhatsApp precisa do DDD, ex.: (11) 99999-9999.",
  );

export const contactSchema = z.object({
  name,
  phone,
  subject: z.string().trim().min(1, "Escolha um assunto.").max(120),
  message: z
    .string()
    .trim()
    .min(5, "Escreva uma mensagem rápida.")
    .max(2000, "Mensagem muito longa."),
});

export const tradeSchema = z.object({
  name,
  phone,
  car: z
    .string()
    .trim()
    .min(3, "Qual carro você quer dar na troca?")
    .max(200),
  km: z.string().trim().max(40).optional(),
});

export const interestSchema = z.object({
  name,
  phone,
  vehicleSlug: z.string().trim().min(1).max(200),
});

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function firstErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const kmDigits = (raw?: string): number | null => {
  if (!raw) return null;
  const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export async function createContactLead(input: unknown): Promise<LeadResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos.", fieldErrors: firstErrors(parsed.error) };
  }
  try {
    await prisma.lead.create({
      data: {
        kind: "CONTATO",
        name: parsed.data.name,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível registrar agora. Tente pelo WhatsApp." };
  }
}

export async function createTradeLead(input: unknown): Promise<LeadResult> {
  const parsed = tradeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos.", fieldErrors: firstErrors(parsed.error) };
  }
  try {
    await prisma.lead.create({
      data: {
        kind: "TROCA",
        name: parsed.data.name,
        phone: parsed.data.phone,
        tradeCar: parsed.data.car,
        tradeKm: kmDigits(parsed.data.km),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível registrar agora. Tente pelo WhatsApp." };
  }
}

export async function createInterestLead(input: unknown): Promise<LeadResult> {
  const parsed = interestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos.", fieldErrors: firstErrors(parsed.error) };
  }
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { slug: parsed.data.vehicleSlug },
      select: { id: true, brand: true, model: true, version: true },
    });
    await prisma.lead.create({
      data: {
        kind: "INTERESSE",
        name: parsed.data.name,
        phone: parsed.data.phone,
        vehicleId: vehicle?.id ?? null,
        subject: vehicle
          ? `Interesse: ${vehicle.brand} ${vehicle.model} ${vehicle.version}`
          : `Interesse: ${parsed.data.vehicleSlug}`,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível registrar agora. Tente pelo WhatsApp." };
  }
}
