import type { UiTheme } from "@/lib/i18n/types";

/** Mapbox GL style URLs (requires access token). */
export function mapboxStyleForTheme(theme: UiTheme): string {
  return theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";
}

/**
 * OpenFreeMap public style URLs (no API key). Positron reads well on light UI; Liberty for dark chrome.
 * @see https://openfreemap.org/quick_start
 */
export function openFreeMapStyleForTheme(theme: UiTheme): string {
  return theme === "light"
    ? "https://tiles.openfreemap.org/styles/positron"
    : "https://tiles.openfreemap.org/styles/liberty";
}
