import { BurnMapExperience } from "@/components/burn-map-experience";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import type { MapProviderChoice } from "@/lib/i18n/types";
import { FIRMS_DETECTION_LIST_LIMIT, type FirmsLoadState } from "@/lib/nasa/firms/constants";
import {
  boundsFromFireGeoJSON,
  detectionsToFirePointsGeoJSON,
} from "@/lib/nasa/firms/detections-to-geojson";
import {
  FirmsConfigError,
  fetchGlobalNoaa20Detections,
} from "@/lib/nasa/firms/fetch-detections";
import { compareDetectionsByRecencyAndFrp, summarizeFirmsDetections } from "@/lib/nasa/firms/summary";
import type { FirmsDetection } from "@/lib/nasa/firms/schemas";

/**
 * Server component: loads FIRMS detections, locale dictionary, and hands off UI to {@link BurnMapExperience}.
 */
export async function WildfiresContent() {
  let detections: FirmsDetection[] = [];
  let loadState: FirmsLoadState = "ok";

  try {
    detections = await fetchGlobalNoaa20Detections();
  } catch (error) {
    loadState = error instanceof FirmsConfigError ? "missing-key" : "failed";
  }

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
  const hasMapboxToken = Boolean(mapboxAccessToken.trim());
  const defaultMapProvider: MapProviderChoice = "openfreemap";

  const geojson = detectionsToFirePointsGeoJSON(detections);
  const bounds = boundsFromFireGeoJSON(geojson);
  const summary = summarizeFirmsDetections(detections);
  const visibleDetections = [...detections]
    .sort(compareDetectionsByRecencyAndFrp)
    .slice(0, FIRMS_DETECTION_LIST_LIMIT);

  return (
    <BurnMapExperience
      locale={locale}
      dictionary={dictionary}
      detections={visibleDetections}
      geojson={geojson}
      bounds={bounds}
      summary={summary}
      mapboxAccessToken={mapboxAccessToken}
      hasMapboxToken={hasMapboxToken}
      defaultMapProvider={defaultMapProvider}
      loadState={loadState}
    />
  );
}
