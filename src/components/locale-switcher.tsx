"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

import { BURNMAP_LOCALE_COOKIE } from "@/lib/i18n/constants";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export type LocaleSwitcherProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Sets the `burnmap-locale` cookie and refreshes RSC payloads so server copy matches.
 */
export function LocaleSwitcher({ locale, dictionary }: LocaleSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      document.cookie = `${BURNMAP_LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
      startTransition(() => {
        router.refresh();
      });
    },
    [locale, router],
  );

  return (
    <div className="flex items-center gap-1 rounded-lg border border-current/15 p-0.5 text-xs" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLocale("en")}
        disabled={pending}
        aria-pressed={locale === "en"}
        className={`rounded-md px-2 py-1 font-medium transition-colors ${
          locale === "en" ? "bg-orange-500/20 text-orange-200" : "text-current/70 hover:bg-current/10"
        }`}
      >
        {dictionary.langEnglish}
      </button>
      <button
        type="button"
        onClick={() => setLocale("tr")}
        disabled={pending}
        aria-pressed={locale === "tr"}
        className={`rounded-md px-2 py-1 font-medium transition-colors ${
          locale === "tr" ? "bg-orange-500/20 text-orange-200" : "text-current/70 hover:bg-current/10"
        }`}
      >
        {dictionary.langTurkish}
      </button>
    </div>
  );
}
