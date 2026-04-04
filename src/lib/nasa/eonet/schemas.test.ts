import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { eonetEventsResponseSchema } from "./schemas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("eonetEventsResponseSchema", () => {
  it("parses a representative EONET /events JSON payload", () => {
    const raw = readFileSync(
      path.join(__dirname, "__fixtures__", "events-response.json"),
      "utf8",
    );
    const json: unknown = JSON.parse(raw);
    const parsed = eonetEventsResponseSchema.safeParse(json);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.events).toHaveLength(1);
      expect(parsed.data.events[0]?.id).toBe("EONET_TEST_1");
      const geom = parsed.data.events[0]?.geometry[0];
      expect(geom?.type).toBe("Point");
      if (geom?.type === "Point") {
        expect(geom.coordinates).toEqual([-92.6888328, 45.7153853]);
      }
    }
  });
});
