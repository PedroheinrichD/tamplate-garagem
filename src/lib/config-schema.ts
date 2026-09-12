import { z } from "zod";

const s = (max = 300) => z.string().trim().max(max);

export const siteConfigSchema = z.object({
  name: s(120).min(1, "Obrigatório."),
  shortName: s(60).min(1, "Obrigatório."),
  tagline: s(300).min(1, "Obrigatório."),
  soldCount: z.coerce.number().int().min(0),
  yearsActive: z.coerce.number().int().min(0),
  instagramHandle: s(60),
  instagramUrl: s(300),
  whatsappNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 12 && v.length <= 13, "Use DDI + DDD + número (só dígitos)."),
  whatsappMessage: s(300).min(1, "Obrigatório."),
  email: z.string().trim().email("E-mail inválido."),
  addressStreet: s(200),
  addressDistrict: s(120),
  addressCity: s(120),
  addressState: s(4),
  addressZip: s(12),
  mapsUrl: s(400),
  hours: z
    .string()
    .transform((raw) => {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((h) => h && typeof h.days === "string" && typeof h.time === "string")
            .map((h) => ({ days: h.days.trim(), time: h.time.trim() }))
            .filter((h) => h.days && h.time);
        }
      } catch {
        // ignora
      }
      return [] as { days: string; time: string }[];
    }),
});

export type SiteConfigInput = z.infer<typeof siteConfigSchema>;
