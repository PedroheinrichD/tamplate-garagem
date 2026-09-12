"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";

const nav = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/veiculos", label: "Veículos" },
  { href: "/admin/destaques", label: "Destaques" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/config", label: "Dados da loja" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminHeader({
  userEmail,
  signOutAction,
}: {
  userEmail: string;
  signOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-bg-elev">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-semibold text-fg">
              Benevento&rsquo;s · Painel
            </span>
            <nav className="hidden items-center gap-4 sm:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.85rem] hover:text-fg ${
                    isActive(pathname, item.href) ? "text-fg" : "text-fg-dim"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="hidden text-[0.8rem] text-muted md:inline">
              {userEmail}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded border border-border-strong px-3 py-1.5 text-[0.8rem] text-fg-dim hover:border-fg hover:text-fg"
              >
                Sair
              </button>
            </form>
          </div>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex size-10 items-center justify-center text-fg sm:hidden"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-border sm:hidden">
          <Container width="wide">
            <nav className="flex flex-col py-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-border py-3 text-[0.9rem] ${
                    isActive(pathname, item.href) ? "text-fg" : "text-fg-dim"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 pb-2">
                <span className="text-[0.8rem] text-muted">{userEmail}</span>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="rounded border border-border-strong px-3 py-1.5 text-[0.8rem] text-fg-dim hover:border-fg hover:text-fg"
                  >
                    Sair
                  </button>
                </form>
              </div>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
