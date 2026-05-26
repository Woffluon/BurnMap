import { describe, expect, it } from "vitest";

import { compareDetectionsByRecencyAndFrp, summarizeFirmsDetections } from "./summary";
import type { FirmsDetection } from "./schemas";

const baseDetection: FirmsDetection = {
  latitude: 5.9508,
  longitude: 100.65701,
  bright_ti4: 330.44,
  scan: 0.4,
  track: 0.37,
  acq_date: "2025-06-04",
  acq_time: "0631",
  satellite: "N20",
  instrument: "VIIRS",
  confidence: "n",
  version: "2.0NRT",
  bright_ti5: 295.66,
  frp: 2.24,
  daynight: "D",
};

describe("summarizeFirmsDetections", () => {
  it("calculates operational totals", () => {
    const detections: FirmsDetection[] = [
      baseDetection,
      {
        ...baseDetection,
        confidence: "h",
        daynight: "N",
        acq_date: "2025-06-06",
        acq_time: "0922",
        frp: 9.86,
      },
    ];

    const summary = summarizeFirmsDetections(detections);
    expect(summary.total).toBe(2);
    expect(summary.highConfidence).toBe(1);
    expect(summary.night).toBe(1);
    expect(summary.day).toBe(1);
    expect(summary.totalFrp).toBeCloseTo(12.1);
    expect(summary.peakFrp).toBe(9.86);
    expect(summary.latestAcquiredAt).toBe("2025-06-06T09:22:00.000Z");
  });

  it("returns empty summary values for no detections", () => {
    expect(summarizeFirmsDetections([])).toEqual({
      total: 0,
      highConfidence: 0,
      night: 0,
      day: 0,
      totalFrp: 0,
      peakFrp: 0,
      latestAcquiredAt: null,
    });
  });
});

describe("compareDetectionsByRecencyAndFrp", () => {
  it("sorts newer detections first, then stronger FRP", () => {
    const older = baseDetection;
    const newerLowFrp = { ...baseDetection, acq_date: "2025-06-06", acq_time: "0922", frp: 1 };
    const newerHighFrp = { ...newerLowFrp, frp: 10 };

    expect([older, newerLowFrp, newerHighFrp].sort(compareDetectionsByRecencyAndFrp)).toEqual([
      newerHighFrp,
      newerLowFrp,
      older,
    ]);
  });
});
