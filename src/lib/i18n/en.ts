import type { Dictionary } from "./types";

export const en: Dictionary = {
  heroKicker: "NASA EONET · Live feed",
  heroTitle: "BurnMap",
  heroStatsTemplate:
    "<<COUNT>> open wildfires in the last {days} days (global, EONET v3).",
  heroStatsSingular:
    "<<COUNT>> open wildfire in the last {days} days (global, EONET v3).",
  eonetUnavailable:
    "NASA EONET could not be reached. Showing an empty incident set until the service is available again.",
  emptyList: "No open wildfires returned for this window.",
  incidentsListLabel: "Wildfire incidents",
  areaMultiPoint: "Area / multi-point",
  mapAria: "Wildfire locations map. Use pinch or scroll to zoom and drag to pan.",
  mapLoading: "Loading map",
  mapTokenMissingTitle: "Mapbox token missing",
  mapTokenMissingBody:
    "Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local, restart the dev server, and reload — or switch to the free OpenFreeMap layer below.",
  mapSwitchToFree: "Use free map (OpenFreeMap)",
  themeLight: "Light",
  themeDark: "Dark",
  langEnglish: "English",
  langTurkish: "Turkish",
  providerMapbox: "Mapbox",
  providerOpenFreeMap: "OpenFreeMap (free)",
  disclaimerTitle: "Free map layer notice",
  disclaimerIntro:
    "OpenFreeMap is a community-hosted, no-API-key alternative. Before continuing, please note:",
  disclaimerBullet1:
    "No uptime or performance SLA — outages or slowdowns can happen at any time.",
  disclaimerBullet2: "Heavy traffic may affect tile load times.",
  disclaimerBullet3:
    "You rely on a third-party service; review their terms and privacy practices yourself.",
  disclaimerBullet4:
    "OpenStreetMap and style providers require visible attribution (kept on by default).",
  disclaimerConfirm: "I understand",
  disclaimerCancel: "Cancel",
};
