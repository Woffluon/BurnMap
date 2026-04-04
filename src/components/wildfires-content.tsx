import { BurnMapExperience } from "@/components/burn-map-experience";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import type { MapProviderChoice } from "@/lib/i18n/types";
import { DEFAULT_WILDFIRE_DAYS } from "@/lib/nasa/eonet/constants";
import {
  boundsFromWildfireGeoJSON,
  eventsToWildfirePointsGeoJSON,
} from "@/lib/nasa/eonet/events-to-geojson";
import { fetchOpenWildfires } from "@/lib/nasa/eonet/fetch-events";
import type { EonetEventsResponse } from "@/lib/nasa/eonet/schemas";

/** Shape used when EONET is unreachable so static generation and CI builds still succeed. */
const EMPTY_EONET_RESPONSE: EonetEventsResponse = {
  title: "EONET Events",
  description: null,
  link: "https://eonet.gsfc.nasa.gov/api/v3/events",
  events: [],
};

/**
 * Server component: loads EONET data, locale dictionary, and hands off UI to {@link BurnMapExperience}.
 */
export async function WildfiresContent() {
  let data: EonetEventsResponse = EMPTY_EONET_RESPONSE;
  let loadFailed = false;

  try {
    data = await fetchOpenWildfires(DEFAULT_WILDFIRE_DAYS);
  } catch {
    loadFailed = true;
  }

  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
  const hasMapboxToken = Boolean(mapboxAccessToken.trim());
  const defaultMapProvider: MapProviderChoice = hasMapboxToken ? "mapbox" : "openfreemap";

  const geojson = eventsToWildfirePointsGeoJSON(data.events);
  const bounds = boundsFromWildfireGeoJSON(geojson);

  return (
    <BurnMapExperience
      locale={locale}
      dictionary={dictionary}
      events={data.events}
      geojson={geojson}
      bounds={bounds}
      mapboxAccessToken={mapboxAccessToken}
      hasMapboxToken={hasMapboxToken}
      defaultMapProvider={defaultMapProvider}
      loadFailed={loadFailed}
      days={DEFAULT_WILDFIRE_DAYS}
    />
  );
}
