import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded font-medium tracking-tight transition-[transform,background-color,border-color,color] duration-200 ease-out active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-hover",
  outline:
    "border border-border-strong text-fg hover:border-fg hover:bg-white/[0.04]",
  ghost: "text-fg-dim hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9rem]",
  lg: "h-13 px-7 text-[0.95rem]",
};

function cx(variant: Variant, size: Size, className?: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cx(variant, size, className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cx(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">) {
  return (
    <button className={cx(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
