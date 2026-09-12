"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/actions/auth";

const initial: SignInState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);

  const inputBase =
    "h-11 w-full rounded border border-border-strong bg-bg-elev px-3.5 text-fg placeholder:text-muted focus-visible:border-accent focus-visible:outline-none";

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[0.85rem] text-fg">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputBase}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[0.85rem] text-fg">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputBase}
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-[0.85rem] text-accent-hover">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded bg-accent px-6 font-medium text-accent-ink transition-colors duration-200 hover:bg-accent-hover active:translate-y-px disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
