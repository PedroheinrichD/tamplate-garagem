"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * Deslocamento vertical sutil enquanto a secao cruza a viewport.
 * `speed` positivo = sobe mais devagar que o scroll (fundo).
 */
export function Parallax({
  children,
  speed = 0.14,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
