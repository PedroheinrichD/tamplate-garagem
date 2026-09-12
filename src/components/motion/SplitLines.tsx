"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * Titulo com revelacao linha a linha por mascara. As quebras de linha sao
 * definidas pelo chamador (array `lines`), sem medicao fragil de layout.
 */
export function SplitLines({
  lines,
  as: Tag = "h2",
  className,
  start = "top 90%",
  immediate = false,
  delay = 0,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  start?: string;
  immediate?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inners = el.querySelectorAll<HTMLElement>(".split-line");

    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 108 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 0.95,
        ease: "power4.out",
        stagger: 0.08,
        delay: immediate ? delay + 0.15 : delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span className="split-line-mask" key={i} aria-hidden="true">
          <span className="split-line">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
