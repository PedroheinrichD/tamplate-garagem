import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
};

/** Sessão atual (ou null). Nunca lança. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

/** Exige sessão; sem ela, manda para o login. Uso em páginas do admin. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
