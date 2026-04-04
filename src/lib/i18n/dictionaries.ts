import { en } from "./en";
import { tr } from "./tr";
import type { Dictionary, Locale } from "./types";

/**
 * Returns the UI copy bundle for a locale (used in RSC and passed to client as props).
 */
export function getDictionary(locale: Locale): Dictionary {
  return locale === "tr" ? tr : en;
}

export type { Dictionary, Locale };
