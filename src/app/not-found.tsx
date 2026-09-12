import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-display text-6xl font-semibold text-fg">404</p>
      <p className="text-[1rem] text-fg-dim">Página não encontrada.</p>
      <Link
        href="/"
        className="inline-flex h-11 items-center rounded bg-accent px-6 font-medium text-accent-ink hover:bg-accent-hover"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
