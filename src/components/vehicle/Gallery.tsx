"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr";
import { Placeholder } from "@/components/ui/Placeholder";
import type { VehiclePhoto } from "@/types/vehicle";

export function Gallery({
  name,
  photos,
}: {
  name: string;
  photos: VehiclePhoto[];
}) {
  const indices = Array.from(
    { length: Math.max(photos.length, 1) },
    (_, i) => i,
  );
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const swipeX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => {
      setCurrent((c) => (c + dir + indices.length) % indices.length);
    },
    [indices.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  const frame = (i: number, big = false) => {
    const photo = photos[i];
    const label = `${name} · foto ${i + 1} de ${indices.length}`;
    if (!photo) {
      return (
        <Placeholder
          label={label}
          ratio={big ? "16 / 10" : "4 / 3"}
          className={big ? "" : "rounded-none border-0"}
        />
      );
    }
    return (
      <div
        className={`relative isolate bg-surface-2 ${big ? "overflow-hidden rounded border border-border" : ""}`}
        style={{ aspectRatio: big ? "16 / 10" : "4 / 3" }}
      >
        <Image
          src={photo.url}
          alt={photo.alt ?? label}
          fill
          priority={i === 0 && !big}
          sizes={big ? "(max-width: 900px) 100vw, 900px" : "(max-width: 1024px) 100vw, 60vw"}
          className="object-cover"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="group block overflow-hidden rounded border border-border"
        aria-label="Ampliar foto"
      >
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.02]">
          {frame(current)}
        </div>
      </button>

      {indices.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {indices.map((i) => {
            const photo = photos[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === current}
                className={`overflow-hidden rounded border transition-colors ${
                  i === current
                    ? "border-accent"
                    : "border-border hover:border-border-strong"
                }`}
              >
                {photo ? (
                  <div
                    className="relative isolate bg-surface-2"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt ?? `Foto ${i + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <Placeholder
                    label={`Foto ${i + 1}`}
                    ratio="1 / 1"
                    compact
                    className="rounded-none border-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}

      {lightbox ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos do ${name}`}
          onClick={() => setLightbox(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => (swipeX.current = e.clientX)}
            onPointerUp={(e) => {
              if (swipeX.current === null) return;
              const dx = e.clientX - swipeX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              swipeX.current = null;
            }}
          >
            {frame(current, true)}
          </div>

          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded border border-white/20 text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>

          {indices.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded border border-white/20 text-white hover:bg-white/10"
              >
                <CaretLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Próxima foto"
                className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded border border-white/20 text-white hover:bg-white/10"
              >
                <CaretRight size={20} />
              </button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.85rem] text-white/70 tnum">
                {current + 1} / {indices.length}
              </p>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
