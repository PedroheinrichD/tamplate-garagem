"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/site";
import { WhatsappCta } from "@/components/ui/WhatsappCta";

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex items-baseline gap-2 font-display text-lg font-semibold tracking-tight text-fg"
    >
      <span
        aria-hidden
        className="mb-[3px] size-2 shrink-0 self-center bg-accent transition-transform duration-300 ease-out group-hover:rotate-45"
      />
      Benevento&rsquo;s
      <span className="text-[0.7rem] font-normal text-muted">veículos</span>
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Detecta scroll sem listener de scroll: observa uma sentinela no topo.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    Object.assign(sentinel.style, {
      position: "absolute",
      top: "90px",
      left: "0",
      width: "1px",
      height: "1px",
      pointerEvents: "none",
    });
    document.body.appendChild(sentinel);

    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);

    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  // Trava o scroll do body com o menu aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ease-out ${
        scrolled || open
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-[height] duration-300 ease-out sm:px-8 ${
          scrolled ? "h-16" : "h-[4.5rem]"
        }`}
      >
        <Wordmark />

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const base = item.href.replace(/#.*$/, "");
            const active =
              base === "/" || base === ""
                ? pathname === "/"
                : pathname.startsWith(base);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[0.9rem] transition-colors duration-200 hover:text-fg ${
                  active ? "text-fg" : "text-fg-dim"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <WhatsappCta>Falar no WhatsApp</WhatsappCta>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex size-10 items-center justify-center text-fg lg:hidden"
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {open ? (
        <div className="lg:hidden">
          <nav className="flex flex-col border-t border-border bg-bg px-5 pb-8 pt-2 sm:px-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-display text-xl font-medium text-fg"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-6">
              <WhatsappCta size="lg" className="w-full">
                Falar no WhatsApp
              </WhatsappCta>
            </div>
            <p className="pt-4 text-sm text-muted">
              {site.instagram.handle}
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
