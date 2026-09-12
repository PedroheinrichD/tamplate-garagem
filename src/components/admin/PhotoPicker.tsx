"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_SIZE = 8 * 1024 * 1024; // mesmo limite do bucket (ver storage.ts)

/**
 * Seletor de fotos com preview local (object URL), sem enviar nada ainda.
 * Quem usa decide quando (e se) as fotos em `files` sobem pro Storage.
 */
export function PhotoPicker({
  files,
  onChange,
  disabled = false,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Preview local; as URLs são revogadas no efeito abaixo assim que a lista muda ou o componente desmonta.
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    const tooBig = incoming.find((f) => f.size > MAX_SIZE);
    setError(tooBig ? `${tooBig.name} passa de 8MB.` : null);
    onChange([...files, ...incoming.filter((f) => f.size <= MAX_SIZE)]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(i: number) {
    onChange(files.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-3">
      {files.length > 0 ? (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${f.lastModified}-${i}`}
              className="group relative aspect-square overflow-hidden rounded border border-border bg-surface-2"
            >
              {previews[i] ? (
                // Preview local via blob: URL - next/image não serve esse esquema.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previews[i]}
                  alt={f.name}
                  className="size-full object-cover"
                />
              ) : null}
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAt(i)}
                aria-label={`Remover ${f.name}`}
                className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0"
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <label
        htmlFor={uid}
        aria-disabled={disabled}
        className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded border border-border-strong px-4 text-[0.85rem] font-medium text-fg hover:border-fg aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        <UploadSimple size={16} />
        {files.length > 0 ? "Adicionar mais fotos" : "Escolher fotos"}
      </label>
      <input
        ref={inputRef}
        id={uid}
        type="file"
        accept={ACCEPT}
        multiple
        disabled={disabled}
        onChange={(e) => addFiles(e.target.files)}
        className="sr-only"
      />
      {error ? <p className="text-[0.8rem] text-accent-hover">{error}</p> : null}
    </div>
  );
}
