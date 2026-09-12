import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsappHref(message?: string): string {
  const text = encodeURIComponent(message ?? site.whatsapp.defaultMessage);
  return `${site.whatsapp.href}?text=${text}`;
}

export function WhatsappCta({
  message,
  children = "Falar no WhatsApp",
  className = "",
  size = "md",
  variant = "outline",
}: {
  message?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
  variant?: "outline" | "solid";
}) {
  const sizing =
    size === "lg" ? "h-13 px-7 text-[0.95rem]" : "h-11 px-5 text-[0.9rem]";
  const look =
    variant === "solid"
      ? "bg-accent text-accent-ink hover:bg-accent-hover"
      : "border border-border-strong text-fg hover:border-fg hover:bg-white/[0.04]";
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded font-medium tracking-tight transition-colors duration-200 ease-out active:translate-y-px ${look} ${sizing} ${className}`}
    >
      <WhatsappLogo size={18} weight="fill" aria-hidden />
      {children}
    </a>
  );
}
