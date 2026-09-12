import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

/**
 * Dados institucionais vindos da tabela `configuracoes`, com fallback total para
 * `src/lib/site.ts` (que segue sendo a fonte dos componentes de client até uma
 * migração completa). Editável no painel em /admin/config.
 *
 * Mesma forma do objeto `site`, então trocar `site` -> `await getSiteConfig()`
 * num Server Component é direto.
 */

export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  soldCount: number;
  yearsActive: number;
  instagram: { handle: string; url: string };
  whatsapp: { number: string; display: string; href: string; defaultMessage: string };
  address: {
    street: string;
    district: string;
    city: string;
    state: string;
    zip: string;
    mapsUrl: string;
  };
  hours: { days: string; time: string }[];
  email: string;
};

function displayPhone(digits: string): string {
  const local = digits.replace(/^55/, "");
  const m = local.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : site.whatsapp.display;
}

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  let row: Awaited<ReturnType<typeof prisma.siteConfig.findUnique>> = null;
  try {
    row = await prisma.siteConfig.findUnique({ where: { id: "default" } });
  } catch {
    row = null;
  }

  const pick = <T,>(value: T | null | undefined, fallback: T): T =>
    value === null || value === undefined || value === "" ? fallback : value;

  const number = pick(row?.whatsappNumber, "5500000000000");
  const hours =
    Array.isArray(row?.hours) && row.hours.length
      ? (row.hours as { days: string; time: string }[])
      : [...site.hours];

  return {
    name: pick(row?.name, site.name),
    shortName: pick(row?.shortName, site.shortName),
    tagline: pick(row?.tagline, site.tagline),
    soldCount: pick(row?.soldCount, site.soldCount),
    yearsActive: pick(row?.yearsActive, site.yearsActive),
    instagram: {
      handle: pick(row?.instagramHandle, site.instagram.handle),
      url: pick(row?.instagramUrl, site.instagram.url),
    },
    whatsapp: {
      number,
      display: displayPhone(number),
      href: `https://wa.me/${number}`,
      defaultMessage: pick(row?.whatsappMessage, site.whatsapp.defaultMessage),
    },
    address: {
      street: pick(row?.addressStreet, site.address.street),
      district: pick(row?.addressDistrict, site.address.district),
      city: pick(row?.addressCity, site.address.city),
      state: pick(row?.addressState, site.address.state),
      zip: pick(row?.addressZip, site.address.zip),
      mapsUrl: pick(row?.mapsUrl, site.address.mapsUrl),
    },
    hours,
    email: pick(row?.email, site.email),
  };
});

/** Link do WhatsApp a partir de um número (dígitos) + mensagem. */
export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
