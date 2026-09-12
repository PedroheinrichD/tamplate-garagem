import { Car } from "@phosphor-icons/react/dist/ssr";

/**
 * Espaco reservado para foto real de veiculo. Visual proposital (nao e "slop"):
 * gradiente + silhueta + etiqueta. Trocar por <Image> quando o banco de imagens
 * do cliente estiver disponivel. Toda ocorrencia esta marcada com
 * {/* TODO: foto real *\/} no componente que a usa.
 */
export function Placeholder({
  label,
  ratio = "4 / 3",
  className = "",
  tone = "default",
  compact = false,
}: {
  label: string;
  ratio?: string;
  className?: string;
  tone?: "default" | "hero";
  compact?: boolean;
}) {
  const bg =
    tone === "hero"
      ? "radial-gradient(130% 100% at 20% 12%, rgba(220,65,54,0.28), transparent 52%), radial-gradient(90% 80% at 88% 108%, rgba(120,140,170,0.16), transparent 60%), linear-gradient(165deg, #23232a 0%, #131317 55%, #0c0c0e 100%)"
      : "radial-gradient(110% 90% at 22% 16%, rgba(255,255,255,0.09), transparent 55%), radial-gradient(80% 70% at 90% 100%, rgba(194,42,34,0.10), transparent 60%), linear-gradient(160deg, #262629 0%, #17171b 55%, #121215 100%)";

  return (
    <div
      role="img"
      aria-label={`${label} (foto ilustrativa)`}
      className={`relative isolate flex items-end overflow-hidden rounded border border-border ${className}`}
      style={{ aspectRatio: ratio, background: bg }}
    >
      <Car
        aria-hidden
        weight="thin"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[38%] max-h-[120px] min-h-[44px] -translate-x-1/2 -translate-y-1/2 text-white/[0.07]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 140px rgba(0,0,0,0.5)" }}
      />
      {!compact ? (
        <div className="relative z-10 flex w-full items-center justify-between gap-3 p-4 text-[0.78rem]">
          <span className="rounded bg-black/35 px-2 py-1 text-fg-dim backdrop-blur-sm">
            Foto ilustrativa
          </span>
          <span className="max-w-[58%] truncate rounded bg-black/35 px-2 py-1 text-right text-fg-dim backdrop-blur-sm">
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
