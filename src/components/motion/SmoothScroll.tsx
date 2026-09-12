"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let booted = false;

/**
 * Scroll suave (Lenis) sincronizado com o ticker do GSAP para que o
 * ScrollTrigger e o scroll cinematografico fiquem em fase.
 * Renderiza nada. Respeita prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!booted) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ ease: "power3.out", duration: 0.85 });
      booted = true;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      anchors: { offset: -80 },
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      lenis.destroy();
    };
  }, []);

  // Recalcula posicoes dos gatilhos quando a rota troca.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
