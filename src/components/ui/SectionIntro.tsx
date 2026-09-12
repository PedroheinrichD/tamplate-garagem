import type { ReactNode } from "react";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Cabecalho de secao. `kicker` e opcional e deve ser usado com parcimonia
 * (no maximo em 1 a cada 3 secoes).
 */
export function SectionIntro({
  kicker,
  titleLines,
  lead,
  align = "left",
  as = "h2",
  className = "",
}: {
  kicker?: string;
  titleLines: string[];
  lead?: ReactNode;
  align?: "left" | "center";
  as?: "h2" | "h3";
  className?: string;
}) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start";
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className}`}>
      {kicker ? (
        <Reveal variant="fade-up">
          <span className="text-[0.78rem] text-accent">{kicker}</span>
        </Reveal>
      ) : null}
      <SplitLines
        as={as}
        lines={titleLines}
        className="text-[clamp(1.6rem,6vw,3rem)] font-semibold text-fg"
      />
      {lead ? (
        <Reveal variant="fade-up" delay={0.05}>
          <p className="text-[1.05rem] leading-relaxed text-fg-dim">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
