"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { siteConfigSchema } from "@/lib/config-schema";

export type ConfigFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function updateSiteConfig(
  _prev: ConfigFormState,
  formData: FormData,
): Promise<ConfigFormState> {
  await requireUser();

  const parsed = siteConfigSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Confira os campos.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const data = parsed.data;

  try {
    await prisma.siteConfig.upsert({
      where: { id: "default" },
      create: { id: "default", ...data },
      update: data,
    });
  } catch {
    return { ok: false, error: "Não foi possível salvar." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/contato");
  return { ok: true };
}
