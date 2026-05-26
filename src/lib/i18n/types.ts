/** Supported UI locales for BurnMap. */
export type Locale = "en" | "tr";

/** Basemap engine: commercial Mapbox vs community OpenFreeMap (MapLibre). */
export type MapProviderChoice = "mapbox" | "openfreemap";

/** App chrome theme (Mapbox/OpenFreeMap map styles follow this where possible). */
export type UiTheme = "light" | "dark";

/**
 * Serializable strings passed from the server (RSC) into {@link BurnMapExperience}.
 */
export type Dictionary = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  liveWindowLabel: string;
  sourceLabel: string;
  sourceValue: string;
  detectionsLabel: string;
  latestPassLabel: string;
  highConfidenceLabel: string;
  frpLabel: string;
  peakFrpLabel: string;
  mapPanelTitle: string;
  mapPanelSubtitle: string;
  railTitle: string;
  railSubtitle: string;
  showingLimit: string;
  firmsUnavailable: string;
  firmsKeyMissing: string;
  emptyList: string;
  detectionsListLabel: string;
  confidenceHigh: string;
  confidenceNominal: string;
  confidenceLow: string;
  dayDetection: string;
  nightDetection: string;
  latestUnknown: string;
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
