import { cookies } from "next/headers";

import { BURNMAP_LOCALE_COOKIE } from "./constants";
import type { Locale } from "./types";

/**
 * Reads the preferred locale from the `burnmap-locale` cookie (set by the client switcher).
 */
export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const raw = jar.get(BURNMAP_LOCALE_COOKIE)?.value;
  return raw === "tr" ? "tr" : "en";
}
