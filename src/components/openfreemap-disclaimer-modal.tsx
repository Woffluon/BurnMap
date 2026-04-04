"use client";

import { useEffect, useRef } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

export type OpenFreeMapDisclaimerModalProps = {
  open: boolean;
  dictionary: Pick<
    Dictionary,
    | "disclaimerTitle"
    | "disclaimerIntro"
    | "disclaimerBullet1"
    | "disclaimerBullet2"
    | "disclaimerBullet3"
    | "disclaimerBullet4"
    | "disclaimerConfirm"
    | "disclaimerCancel"
  >;
  onConfirm: () => void;
  onDismiss: () => void;
};

/**
 * Accessible dialog shown before first use of the free OpenFreeMap basemap.
 */
export function OpenFreeMapDisclaimerModal({
  open,
  dictionary,
  onConfirm,
  onDismiss,
}: OpenFreeMapDisclaimerModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ofm-disclaimer-title"
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-zinc-600 bg-zinc-900 p-6 text-zinc-100 shadow-2xl dark:border-zinc-700"
      >
        <h2 id="ofm-disclaimer-title" className="text-lg font-semibold text-orange-200">
          {dictionary.disclaimerTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">{dictionary.disclaimerIntro}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-400">
          <li>{dictionary.disclaimerBullet1}</li>
          <li>{dictionary.disclaimerBullet2}</li>
          <li>{dictionary.disclaimerBullet3}</li>
          <li>{dictionary.disclaimerBullet4}</li>
        </ul>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            ref={closeRef}
            type="button"
            onClick={onDismiss}
            className="rounded-md border border-zinc-600 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            {dictionary.disclaimerCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md border border-orange-500/50 bg-orange-500/20 px-3 py-2 text-sm font-medium text-orange-100 hover:bg-orange-500/30"
          >
            {dictionary.disclaimerConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
