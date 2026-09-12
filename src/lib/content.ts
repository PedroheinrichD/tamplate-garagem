import "server-only";

import { prisma } from "@/lib/db";

/** Conteúdo editorial do site (depoimentos, config institucional). Só servidor. */

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
    select: { quote: true, author: true, context: true },
  });
  return rows;
}
