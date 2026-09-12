import { z } from "zod";

/**
 * Schema de veículo para o painel (create/update). Isomórfico: o form usa as
 * listas de opções, a server action usa o zod para validar.
 * Os valores são os nomes internos dos enums do Prisma.
 */

export const FUEL_OPTIONS = [
  { value: "FLEX", label: "Flex" },
  { value: "GASOLINA", label: "Gasolina" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HIBRIDO", label: "Híbrido" },
  { value: "ELETRICO", label: "Elétrico" },
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATICO", label: "Automático" },
  { value: "AUTOMATIZADO", label: "Automatizado" },
  { value: "CVT", label: "CVT" },
] as const;

export const BODY_OPTIONS = [
  { value: "HATCH", label: "Hatch" },
  { value: "SEDA", label: "Sedã" },
  { value: "SUV", label: "SUV" },
  { value: "PICAPE", label: "Picape" },
  { value: "MINIVAN", label: "Minivan" },
] as const;

export const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Disponível" },
  { value: "RESERVED", label: "Reservado" },
  { value: "SOLD", label: "Vendido" },
] as const;

const nonEmpty = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} é obrigatório.`).max(max);

const currentYear = new Date().getFullYear();
const year = z.coerce
  .number()
  .int()
  .min(1980, "Ano inválido.")
  .max(currentYear + 1, "Ano inválido.");

const lines = z
  .string()
  .trim()
  .transform((v) =>
    v
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  );

const optionalInt = z
  .string()
  .trim()
  .optional()
  .transform((v) => {
    if (!v) return null;
    const n = Number.parseInt(v.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  });

export const vehicleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug muito curto.")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use só minúsculas, números e hífen."),
  brand: nonEmpty("Marca", 60),
  model: nonEmpty("Modelo", 60),
  version: nonEmpty("Versão"),
  year,
  manufactureYear: year,
  price: z.coerce.number().int().min(1, "Preço obrigatório."),
  mileage: z.coerce.number().int().min(0, "Km inválida."),
  fuel: z.enum(["FLEX", "GASOLINA", "DIESEL", "HIBRIDO", "ELETRICO"]),
  transmission: z.enum(["MANUAL", "AUTOMATICO", "AUTOMATIZADO", "CVT"]),
  body: z.enum(["HATCH", "SEDA", "SUV", "PICAPE", "MINIVAN"]),
  color: nonEmpty("Cor", 60),
  doors: z.coerce.number().int().min(2).max(6),
  plateEnd: z.coerce.number().int().min(0).max(9),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]),
  highlights: lines,
  features: lines,
  description: nonEmpty("Descrição", 4000),
  // administrativos (opcionais)
  licensePlate: z.string().trim().max(10).optional().transform((v) => v || null),
  renavam: z.string().trim().max(20).optional().transform((v) => v || null),
  chassis: z.string().trim().max(30).optional().transform((v) => v || null),
  fipeCode: z.string().trim().max(20).optional().transform((v) => v || null),
  purchaseCost: optionalInt,
  internalNotes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || null),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
