import { describe, expect, it } from "vitest";

import {
  boundsFromFireGeoJSON,
  detectionAcquiredAtIso,
  detectionId,
  detectionsToFirePointsGeoJSON,
} from "./detections-to-geojson";
import type { FirmsDetection } from "./schemas";

const detection: FirmsDetection = {
  latitude: 28.30941,
  longitude: 67.33215,
  bright_ti4: 367,
  scan: 0.46,
  track: 0.64,
  acq_date: "2025-06-06",
  acq_time: "0922",
  satellite: "N20",
  instrument: "VIIRS",
  confidence: "h",
  version: "2.0NRT",
  bright_ti5: 310.44,
  frp: 9.86,
  daynight: "D",
};

describe("detection helpers", () => {
  it("creates stable IDs and UTC acquisition timestamps", () => {
    expect(detectionId(detection)).toBe("N20:2025-06-06:0922:28.30941:67.33215");
    expect(detectionAcquiredAtIso(detection)).toBe("2025-06-06T09:22:00Z");
  });
});

describe("detectionsToFirePointsGeoJSON", () => {
  it("returns an empty FeatureCollection for an empty list", () => {
    const fc = detectionsToFirePointsGeoJSON([]);
    expect(fc.type).toBe("FeatureCollection");
    expect(fc.features).toHaveLength(0);
  });

  it("emits Point features with FIRMS properties", () => {
    const fc = detectionsToFirePointsGeoJSON([detection]);
    expect(fc.features).toHaveLength(1);
    const f = fc.features[0];
    expect(f?.geometry.coordinates).toEqual([67.33215, 28.30941]);
    expect(f?.properties.id).toBe("N20:2025-06-06:0922:28.30941:67.33215");
    expect(f?.properties.frp).toBe(9.86);
    expect(f?.properties.confidence).toBe("h");
  });
});

describe("boundsFromFireGeoJSON", () => {
  it("returns null for an empty collection", () => {
    expect(boundsFromFireGeoJSON(detectionsToFirePointsGeoJSON([]))).toBeNull();
  });

  it("returns SW-NE bounds enclosing all points", () => {
    const second: FirmsDetection = {
      ...detection,
      latitude: 40,
      longitude: -100,
    };
    const fc = detectionsToFirePointsGeoJSON([detection, second]);
    expect(boundsFromFireGeoJSON(fc)).toEqual([
      [-100, 28.30941],
      [67.33215, 40],
    ]);
  });
});
