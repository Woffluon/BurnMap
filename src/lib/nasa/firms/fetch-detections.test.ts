import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

import {
  FirmsConfigError,
  FirmsHttpError,
  FirmsParseError,
  buildFirmsAreaCsvUrl,
  fetchFirmsDetections,
  parseFirmsDetectionsCsv,
} from "./fetch-detections";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadFixture(): string {
  return readFileSync(
    path.join(__dirname, "__fixtures__", "viirs-noaa20-response.csv"),
    "utf8",
  );
}

describe("buildFirmsAreaCsvUrl", () => {
  it("builds the global VIIRS NOAA-20 NRT area CSV endpoint", () => {
    const url = buildFirmsAreaCsvUrl(
      { source: "VIIRS_NOAA20_NRT", area: "world", dayRange: 1 },
      { baseUrl: "https://firms.modaps.eosdis.nasa.gov", mapKey: "abc123" },
    );

    expect(url).toBe(
      "https://firms.modaps.eosdis.nasa.gov/api/area/csv/abc123/VIIRS_NOAA20_NRT/world/1",
    );
  });

  it("throws FirmsConfigError when no MAP_KEY is available", () => {
    expect(() =>
      buildFirmsAreaCsvUrl({}, { baseUrl: "https://firms.modaps.eosdis.nasa.gov", mapKey: "" }),
    ).toThrow(FirmsConfigError);
  });
});

describe("parseFirmsDetectionsCsv", () => {
  it("parses a representative VIIRS NOAA-20 CSV payload", () => {
    const detections = parseFirmsDetectionsCsv(loadFixture());

    expect(detections).toHaveLength(3);
    expect(detections[0]).toMatchObject({
      latitude: 5.9508,
      longitude: 100.65701,
      acq_time: "0631",
      confidence: "n",
      frp: 2.24,
    });
    expect(detections[2]?.acq_time).toBe("0003");
  });

  it("throws FirmsParseError when required columns are missing", () => {
    expect(() => parseFirmsDetectionsCsv("latitude,longitude\n1,2")).toThrow(FirmsParseError);
  });

  it("throws FirmsParseError when a row fails schema validation", () => {
    const invalid = loadFixture().replace("5.95080", "95.95080");
    expect(() => parseFirmsDetectionsCsv(invalid)).toThrow(FirmsParseError);
  });
});

describe("fetchFirmsDetections", () => {
  it("returns parsed detections when HTTP and CSV are valid", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => loadFixture(),
    });

    const data = await fetchFirmsDetections({ fetchFn });

    expect(data).toHaveLength(3);
    expect(fetchFn).toHaveBeenCalledOnce();
    const calledUrl = fetchFn.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("/api/area/csv/TEST_MAP_KEY/VIIRS_NOAA20_NRT/world/1");
  });

  it("throws FirmsHttpError when the response is not OK", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => "",
    });

    await expect(fetchFirmsDetections({ fetchFn })).rejects.toMatchObject({
      name: "FirmsHttpError",
      status: 503,
    });
  });

  it("narrows error types for callers that use instanceof", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "",
    });

    try {
      await fetchFirmsDetections({ fetchFn });
      expect.fail("expected throw");
    } catch (error) {
      expect(error).toBeInstanceOf(FirmsHttpError);
    }
  });
});
