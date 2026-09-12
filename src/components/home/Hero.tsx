"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/site";

const HERO_PHOTO_ALT =
  "Chevrolet Tracker branco estacionado na fachada da Benevento's Veículos";

// Art direction: foto vertical dedicada no mobile (evita cortar/esticar a
// foto pensada para paisagem) e a foto horizontal em telas maiores.
function getHeroPictureProps() {
  const common = {
    alt: HERO_PHOTO_ALT,
    fill: true as const,
    sizes: "100vw",
    priority: true,
  };
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...common, src: "/images/tracker-hero-mobile-new.png" });
  const {
    props: { srcSet: desktopSrcSet, ...desktopRest },
  } = getImageProps({ ...common, src: "/images/tracker-hero-new.png" });
  return { mobileSrcSet, desktopSrcSet, desktopRest };
}

export function Hero() {
  const { mobileSrcSet, desktopSrcSet, desktopRest } = getHeroPictureProps();
  const section = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Aproximacao de camera: o carro cresce, gira de leve e sobe enquanto
      // o texto sai de cena. Tudo preso ao progresso do scroll da secao.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      tl.to(photo.current, { scale: 1.16, rotate: 2.2, yPercent: -6, ease: "none" }, 0)
        .to(content.current, { yPercent: -22, autoAlpha: 0, ease: "none" }, 0)
        .to(scrim.current, { opacity: 0.9, ease: "none" }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-24"
    >
      <div className="absolute inset-0 -z-10">
        <div ref={photo} className="absolute inset-0 will-change-transform">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={mobileSrcSet}
            />
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
            <img
              {...desktopRest}
              alt={HERO_PHOTO_ALT}
              className="size-full object-cover object-center md:object-[32%_center]"
            />
          </picture>
        </div>
        {/* Contraste do texto no mobile: o carro ocupa a largura toda, então
            a faixa de conteúdo precisa de um degradê vertical forte. */}
        <div
          aria-hidden
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,11,12,0.12) 0%, rgba(11,11,12,0.38) 24%, rgba(11,11,12,0.78) 40%, rgba(11,11,12,0.9) 62%, rgba(11,11,12,0.95) 100%)",
          }}
        />
        {/* Contraste do texto no desktop/tablet: escurece a metade esquerda
            (onde o texto fica) e deixa o carro, à direita, mais visível. */}
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,11,12,0.9) 0%, rgba(11,11,12,0.78) 30%, rgba(11,11,12,0.35) 50%, rgba(11,11,12,0.04) 68%, transparent 82%)",
          }}
        />
        <div
          ref={scrim}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,11,12,0.15) 0%, rgba(11,11,12,0.08) 45%, rgba(11,11,12,0.85) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <Container className="relative">
        <div ref={content} className="flex max-w-2xl flex-col gap-6">
          <span className="text-[0.82rem] text-accent">
            Garagem de seminovos
          </span>

          <SplitLines
            as="h1"
            immediate
            lines={["Seu próximo carro", "já está aqui."]}
            className="text-[clamp(2rem,8.5vw,5rem)] font-semibold leading-[1.02] text-fg"
          />

          <Reveal variant="fade-up" delay={0.55}>
            <p className="max-w-xl text-[1.1rem] leading-relaxed text-fg-dim">
              {site.tagline} Mais de {site.soldCount} famílias já saíram daqui
              dirigindo.
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={0.68}>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Magnetic>
                <ButtonLink href="/estoque" size="lg">
                  Ver estoque
                </ButtonLink>
              </Magnetic>
              <WhatsappCta size="lg" owner={1} message="Olá! Vi o site e quero ajuda para escolher um carro.">
                Falar no WhatsApp
              </WhatsappCta>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
