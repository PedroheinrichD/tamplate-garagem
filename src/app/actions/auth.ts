"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Supabase Auth não configurado no servidor." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // sem config: nada a fazer
  }
  redirect("/admin/login");
}
