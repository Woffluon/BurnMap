import type { Feature, FeatureCollection, Point } from "geojson";

import type { FirmsConfidence, FirmsDetection, FirmsDayNight } from "./schemas";

export type FireDetectionPointProperties = {
  id: string;
  acquiredAt: string;
  confidence: FirmsConfidence;
  frp: number;
  brightness: number;
  daynight: FirmsDayNight;
  satellite: string;
  instrument: string;
};

export function detectionId(detection: FirmsDetection): string {
  return [
    detection.satellite,
    detection.acq_date,
    detection.acq_time,
    detection.latitude.toFixed(5),
    detection.longitude.toFixed(5),
  ].join(":");
}

export function detectionAcquiredAtIso(detection: FirmsDetection): string {
  const time = detection.acq_time.padStart(4, "0");
  return `${detection.acq_date}T${time.slice(0, 2)}:${time.slice(2, 4)}:00Z`;
}

export function detectionsToFirePointsGeoJSON(
  detections: FirmsDetection[],
): FeatureCollection<Point, FireDetectionPointProperties> {
  const features: Feature<Point, FireDetectionPointProperties>[] = detections.map((detection) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [detection.longitude, detection.latitude],
    },
    properties: {
      id: detectionId(detection),
      acquiredAt: detectionAcquiredAtIso(detection),
      confidence: detection.confidence,
      frp: detection.frp,
      brightness: detection.bright_ti4,
      daynight: detection.daynight,
      satellite: detection.satellite,
      instrument: detection.instrument,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

export function boundsFromFireGeoJSON(
  collection: FeatureCollection<Point, FireDetectionPointProperties>,
): [[number, number], [number, number]] | null {
  if (collection.features.length === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const feature of collection.features) {
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
