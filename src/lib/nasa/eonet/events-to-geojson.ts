import type { Feature, FeatureCollection, Point } from "geojson";

import type { EonetEvent } from "./schemas";

/**
 * Serializable properties attached to each wildfire point for Mapbox layers and popups.
 */
export type WildfirePointProperties = {
  id: string;
  title: string;
  date?: string;
  magnitudeValue?: number;
  magnitudeUnit?: string;
};

/**
 * Reads optional EONET metadata that may sit on Point geometry objects (beyond strict GeoJSON).
 */
function pointGeometryExtras(geometry: EonetEvent["geometry"][number]): {
  date?: string;
  magnitudeValue?: number;
  magnitudeUnit?: string;
} {
  if (geometry.type !== "Point") return {};
  const record = geometry as Record<string, unknown>;
  const date = typeof record.date === "string" ? record.date : undefined;
  const magnitudeValue =
    typeof record.magnitudeValue === "number" ? record.magnitudeValue : undefined;
  const magnitudeUnit =
    typeof record.magnitudeUnit === "string" ? record.magnitudeUnit : undefined;
  return { date, magnitudeValue, magnitudeUnit };
}

/**
 * Converts validated EONET wildfire events into a GeoJSON {@link FeatureCollection} of Points.
 * Events without a Point geometry are skipped (same rule as the incident list copy).
 *
 * @param events - Parsed {@link EonetEvent} array from `fetchOpenWildfires` / `fetchEonetEvents`.
 * @returns A `FeatureCollection` suitable for a Mapbox `geojson` source (including clustering).
 */
export function eventsToWildfirePointsGeoJSON(
  events: EonetEvent[],
): FeatureCollection<Point, WildfirePointProperties> {
  const features: Feature<Point, WildfirePointProperties>[] = [];

  for (const event of events) {
    const point = event.geometry.find((g): g is Extract<(typeof g), { type: "Point" }> => g.type === "Point");
    if (!point) continue;

    const [lng, lat] = point.coordinates;
    const extras = pointGeometryExtras(point);

    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {
        id: event.id,
        title: event.title,
        ...extras,
      },
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Computes a southwest–northeast bounds pair for fitting the map to all point features.
 *
 * @param collection - Output of {@link eventsToWildfirePointsGeoJSON}.
 * @returns `[[minLng, minLat], [maxLng, maxLat]]`, or `null` if there are no features.
 */
export function boundsFromWildfireGeoJSON(
  collection: FeatureCollection<Point, WildfirePointProperties>,
): [[number, number], [number, number]] | null {
  if (collection.features.length === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const feature of collection.features) {
    if (feature.geometry.type !== "Point") continue;
    const [lng, lat] = feature.geometry.coordinates;
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  }

  if (!Number.isFinite(minLng)) return null;

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}
