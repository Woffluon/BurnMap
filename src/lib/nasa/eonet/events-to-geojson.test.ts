import { describe, expect, it } from "vitest";

import type { EonetEvent } from "./schemas";

import { boundsFromWildfireGeoJSON, eventsToWildfirePointsGeoJSON } from "./events-to-geojson";

const pointEvent: EonetEvent = {
  id: "EONET_TEST",
  title: "Test fire",
  description: null,
  link: "https://example.com",
  closed: null,
  categories: [{ id: "wildfires", title: "Wildfires" }],
  sources: [],
  geometry: [
    {
      type: "Point",
      coordinates: [-120.5, 45.25],
      date: "2026-04-01T00:00:00Z",
      magnitudeValue: 500,
      magnitudeUnit: "acres",
    },
  ],
};

const polygonOnlyEvent: EonetEvent = {
  ...pointEvent,
  id: "EONET_POLY",
  geometry: [
    {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    },
  ],
};

describe("eventsToWildfirePointsGeoJSON", () => {
  it("returns an empty FeatureCollection for an empty list", () => {
    const fc = eventsToWildfirePointsGeoJSON([]);
    expect(fc.type).toBe("FeatureCollection");
    expect(fc.features).toHaveLength(0);
  });

  it("emits one Point feature with coordinates and EONET extras", () => {
    const fc = eventsToWildfirePointsGeoJSON([pointEvent]);
    expect(fc.features).toHaveLength(1);
    const f = fc.features[0];
    expect(f?.geometry.type).toBe("Point");
    if (f?.geometry.type === "Point") {
      expect(f.geometry.coordinates).toEqual([-120.5, 45.25]);
    }
    expect(f?.properties.id).toBe("EONET_TEST");
    expect(f?.properties.title).toBe("Test fire");
    expect(f?.properties.date).toBe("2026-04-01T00:00:00Z");
    expect(f?.properties.magnitudeValue).toBe(500);
    expect(f?.properties.magnitudeUnit).toBe("acres");
  });

  it("skips events that have no Point geometry", () => {
    const fc = eventsToWildfirePointsGeoJSON([polygonOnlyEvent]);
    expect(fc.features).toHaveLength(0);
  });
});

describe("boundsFromWildfireGeoJSON", () => {
  it("returns null for an empty collection", () => {
    expect(boundsFromWildfireGeoJSON(eventsToWildfirePointsGeoJSON([]))).toBeNull();
  });

  it("returns SW–NE bounds enclosing all points", () => {
    const second: EonetEvent = {
      ...pointEvent,
      id: "E2",
      geometry: [{ type: "Point", coordinates: [-100, 40] }],
    };
    const fc = eventsToWildfirePointsGeoJSON([pointEvent, second]);
    const b = boundsFromWildfireGeoJSON(fc);
    expect(b).toEqual([
      [-120.5, 40],
      [-100, 45.25],
    ]);
  });
});
