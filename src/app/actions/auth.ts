"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/better-auth";

export type SignInState = { error: string | null };

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  try {
    // O plugin nextCookies() (src/lib/better-auth.ts) propaga o cookie de
    // sessão automaticamente pra essa Server Action - sem isso precisaria
    // repassar Set-Cookie manualmente.
    await auth.api.signInEmail({ body: { email, password } });
  } catch (err) {
    if (err instanceof APIError) {
      return { error: "E-mail ou senha inválidos." };
    }
    throw err;
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    // sem sessão: nada a fazer
  }
  redirect("/admin/login");
}
