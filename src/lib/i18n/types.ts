/** Supported UI locales for BurnMap. */
export type Locale = "en" | "tr";

/** Basemap engine: commercial Mapbox vs community OpenFreeMap (MapLibre). */
export type MapProviderChoice = "mapbox" | "openfreemap";

/** App chrome theme (Mapbox/OpenFreeMap map styles follow this where possible). */
export type UiTheme = "light" | "dark";

/**
 * Serializable strings passed from the server (RSC) into {@link BurnMapExperience}.
 * Template tokens: `{count}`, `{days}` in `heroStatsTemplate`.
 */
export type Dictionary = {
  heroKicker: string;
  heroTitle: string;
  /** Use `<<COUNT>>`, `{days}` — `<<COUNT>>` splits layout for styled number. */
  heroStatsTemplate: string;
  heroStatsSingular: string;
  eonetUnavailable: string;
  emptyList: string;
  incidentsListLabel: string;
  areaMultiPoint: string;
  mapAria: string;
  mapLoading: string;
  mapTokenMissingTitle: string;
  mapTokenMissingBody: string;
  mapSwitchToFree: string;
  themeLight: string;
  themeDark: string;
  langEnglish: string;
  langTurkish: string;
  providerMapbox: string;
  providerOpenFreeMap: string;
  disclaimerTitle: string;
  disclaimerIntro: string;
  disclaimerBullet1: string;
  disclaimerBullet2: string;
  disclaimerBullet3: string;
  disclaimerBullet4: string;
  disclaimerConfirm: string;
  disclaimerCancel: string;
};
