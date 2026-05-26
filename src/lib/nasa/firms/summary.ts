import { detectionAcquiredAtIso } from "./detections-to-geojson";
import type { FirmsDetection } from "./schemas";

export type FirmsDetectionSummary = {
  total: number;
  highConfidence: number;
  night: number;
  day: number;
  totalFrp: number;
  peakFrp: number;
  latestAcquiredAt: string | null;
};

export function compareDetectionsByRecencyAndFrp(
  a: FirmsDetection,
  b: FirmsDetection,
): number {
  const timeDelta =
    Date.parse(detectionAcquiredAtIso(b)) - Date.parse(detectionAcquiredAtIso(a));
  if (timeDelta !== 0) return timeDelta;
  return b.frp - a.frp;
}

export function summarizeFirmsDetections(
  detections: FirmsDetection[],
): FirmsDetectionSummary {
  let highConfidence = 0;
  let night = 0;
  let day = 0;
  let totalFrp = 0;
  let peakFrp = 0;
  let latestMs = Number.NEGATIVE_INFINITY;

  for (const detection of detections) {
    if (detection.confidence === "h") highConfidence += 1;
    if (detection.daynight === "N") night += 1;
    if (detection.daynight === "D") day += 1;

    totalFrp += detection.frp;
    peakFrp = Math.max(peakFrp, detection.frp);
    latestMs = Math.max(latestMs, Date.parse(detectionAcquiredAtIso(detection)));
  }

  return {
    total: detections.length,
    highConfidence,
    night,
    day,
    totalFrp,
    peakFrp,
    latestAcquiredAt: Number.isFinite(latestMs) ? new Date(latestMs).toISOString() : null,
  };
}
