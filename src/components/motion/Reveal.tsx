"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

type Variant = "fade-up" | "blur-in" | "rise" | "scale";

const from: Record<Variant, gsap.TweenVars> = {
  "fade-up": { y: 28, autoAlpha: 0 },
  "blur-in": { y: 16, autoAlpha: 0, filter: "blur(12px)" },
  rise: { y: 52, autoAlpha: 0 },
  scale: { scale: 0.965, autoAlpha: 0 },
};

/**
 * Revela o proprio elemento ao entrar na viewport. Com `stagger`, revela os
 * filhos marcados com [data-reveal-item] em sequencia.
 */
export function Reveal({
  children,
  variant = "fade-up",
  stagger = false,
  delay = 0,
  start = "top 88%",
  className,
  id,
}: {
  children: ReactNode;
  variant?: Variant;
  stagger?: boolean;
  delay?: number;
  start?: string;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets: Element[] = stagger
        ? gsap.utils.toArray("[data-reveal-item]", el)
        : [el];
      if (targets.length === 0) return;

      gsap.set(targets, from[variant]);
      gsap.to(targets, {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.95,
        ease: "power3.out",
        delay,
        stagger: stagger ? 0.09 : 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
}
