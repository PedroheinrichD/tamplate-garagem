import Image from "next/image";
import { Placeholder } from "@/components/ui/Placeholder";
import type { VehiclePhoto } from "@/types/vehicle";

/**
 * Foto de veículo vinda de veiculo_fotos. Sem foto -> cai no Placeholder,
 * preservando o comportamento visual anterior. Mesma casca do Placeholder
 * (relative isolate overflow-hidden rounded border), então os overrides
 * `rounded-none border-0` dos chamadores continuam valendo.
 */
export function VehicleImage({
  photo,
  label,
  ratio = "4 / 3",
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  photo?: VehiclePhoto | null;
  label: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!photo) {
    return <Placeholder label={label} ratio={ratio} className={className} />;
  }
  return (
    <div
      className={`relative isolate overflow-hidden rounded border border-border bg-surface-2 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={photo.url}
        alt={photo.alt ?? label}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
