import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

import {
  EonetHttpError,
  EonetParseError,
  buildEonetEventsSearchParams,
  fetchEonetEvents,
} from "./fetch-events";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadFixture(): unknown {
  const raw = readFileSync(
    path.join(__dirname, "__fixtures__", "events-response.json"),
    "utf8",
  );
  return JSON.parse(raw) as unknown;
}

describe("buildEonetEventsSearchParams", () => {
  it("serializes array filters as comma-separated query values", () => {
    const params = buildEonetEventsSearchParams({
      category: ["wildfires", "severeStorms"],
      status: "open",
      days: 7,
    });
    expect(params.get("category")).toBe("wildfires,severeStorms");
    expect(params.get("status")).toBe("open");
    expect(params.get("days")).toBe("7");
  });
});

describe("fetchEonetEvents", () => {
  it("returns parsed data when HTTP and JSON are valid", async () => {
    const fixture = loadFixture();
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => fixture,
    });

    const data = await fetchEonetEvents({ fetchFn, limit: 1, category: ["wildfires"] });

    expect(data.events).toHaveLength(1);
    expect(fetchFn).toHaveBeenCalledOnce();
    const calledUrl = fetchFn.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("eonet.gsfc.nasa.gov/api/v3/events");
    expect(calledUrl).toContain("category=wildfires");
    expect(calledUrl).toContain("limit=1");
  });

  it("throws EonetHttpError when the response is not OK", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    await expect(fetchEonetEvents({ fetchFn })).rejects.toMatchObject({
      name: "EonetHttpError",
      status: 503,
    });
  });

  it("throws EonetParseError when JSON does not match the schema", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: true }),
    });

    await expect(fetchEonetEvents({ fetchFn })).rejects.toMatchObject({
      name: "EonetParseError",
    });
  });

  it("narrows error types for callers that use instanceof", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    try {
      await fetchEonetEvents({ fetchFn });
      expect.fail("expected throw");
    } catch (e) {
      expect(e).toBeInstanceOf(EonetHttpError);
    }

    const fetchFnBadJson = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ foo: "bar" }),
    });
    try {
      await fetchEonetEvents({ fetchFn: fetchFnBadJson });
      expect.fail("expected throw");
    } catch (e) {
      expect(e).toBeInstanceOf(EonetParseError);
    }
  });
});
