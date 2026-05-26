import type { Dictionary } from "./types";

export const en: Dictionary = {
  heroKicker: "NASA FIRMS · VIIRS NOAA-20 NRT",
  heroTitle: "BurnMap",
  heroSubtitle:
    "Global active-fire detections from the last 24 hours, shaped for fast operational scanning.",
  liveWindowLabel: "Window",
  sourceLabel: "Source",
  sourceValue: "VIIRS NOAA-20 NRT",
  detectionsLabel: "Detections",
  latestPassLabel: "Latest pass",
  highConfidenceLabel: "High confidence",
  frpLabel: "Total FRP",
  peakFrpLabel: "Peak FRP",
  mapPanelTitle: "Active-fire field",
  mapPanelSubtitle: "Clustered detections colored by confidence and FRP.",
  railTitle: "Detection queue",
  railSubtitle: "Latest records first, then strongest FRP.",
  showingLimit: "Showing top 100 records when the feed is larger.",
  firmsUnavailable:
    "NASA FIRMS could not be reached. Showing an empty detection set until the service is available again.",
  firmsKeyMissing:
    "NASA_FIRMS_MAP_KEY is not configured. Add a FIRMS MAP_KEY on the server to load live detections.",
  emptyList: "No FIRMS detections returned for this window.",
  detectionsListLabel: "FIRMS fire detections",
  confidenceHigh: "High",
  confidenceNominal: "Nominal",
  confidenceLow: "Low",
  dayDetection: "Day",
  nightDetection: "Night",
  latestUnknown: "No pass yet",
  mapAria: "Active-fire detection map. Use pinch or scroll to zoom and drag to pan.",
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
