import type { z } from "zod";

import { env } from "@/env";
import {
  DEFAULT_FIRMS_AREA,
  DEFAULT_FIRMS_DAY_RANGE,
  DEFAULT_FIRMS_SOURCE,
  FIRMS_AREA_CSV_PATH,
} from "./constants";
import {
  firmsAreaCsvQuerySchema,
  firmsDetectionSchema,
  type FirmsArea,
  type FirmsAreaCsvQuery,
  type FirmsDetection,
} from "./schemas";

const FIRMS_REQUIRED_COLUMNS = [
  "latitude",
  "longitude",
  "bright_ti4",
  "scan",
  "track",
  "acq_date",
  "acq_time",
  "satellite",
  "instrument",
  "confidence",
  "version",
  "bright_ti5",
  "frp",
  "daynight",
] as const;

export class FirmsConfigError extends Error {
  readonly name = "FirmsConfigError";
}

export class FirmsHttpError extends Error {
  readonly name = "FirmsHttpError";

  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
  }
}

export class FirmsParseError extends Error {
  readonly name = "FirmsParseError";

  constructor(
    message: string,
    readonly details: readonly string[] | z.ZodIssue[],
  ) {
    super(message);
  }
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

export function parseFirmsDetectionsCsv(csvText: string): FirmsDetection[] {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0] ?? "");
  const missing = FIRMS_REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missing.length > 0) {
    throw new FirmsParseError("FIRMS CSV is missing required columns", missing);
  }

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""]));
    const parsed = firmsDetectionSchema.safeParse(record);

    if (!parsed.success) {
      throw new FirmsParseError(
        `FIRMS CSV row ${index + 2} failed schema validation`,
        parsed.error.issues,
      );
    }

    return parsed.data;
  });
}

function areaPathSegment(area: FirmsArea): string {
  return area === "world" ? "world" : area.join(",");
}

export function buildFirmsAreaCsvUrl(
  query: FirmsAreaCsvQuery = {},
  options: { baseUrl?: string; mapKey?: string } = {},
): string {
  const parsed = firmsAreaCsvQuerySchema.parse(query);
  const base = (options.baseUrl ?? env.FIRMS_API_BASE_URL).replace(/\/$/, "");
  const mapKey = options.mapKey ?? env.NASA_FIRMS_MAP_KEY?.trim();

  if (!mapKey) {
    throw new FirmsConfigError("NASA_FIRMS_MAP_KEY is required to fetch FIRMS data");
  }

  const source = parsed.source ?? DEFAULT_FIRMS_SOURCE;
  const area = parsed.area ?? DEFAULT_FIRMS_AREA;
  const dayRange = parsed.dayRange ?? DEFAULT_FIRMS_DAY_RANGE;
  const url = `${base}${FIRMS_AREA_CSV_PATH}/${encodeURIComponent(mapKey)}/${source}/${areaPathSegment(area)}/${dayRange}`;

  return parsed.date ? `${url}/${parsed.date}` : url;
}

export type FetchFirmsDetectionsOptions = FirmsAreaCsvQuery & {
  fetchFn?: typeof fetch;
  next?: RequestInit["next"];
};

export async function fetchFirmsDetections(
  options: FetchFirmsDetectionsOptions = {},
): Promise<FirmsDetection[]> {
  const { fetchFn = fetch, next, ...query } = options;
  const url = buildFirmsAreaCsvUrl(query);

  const res = await fetchFn(url, {
    method: "GET",
    headers: { Accept: "text/csv, text/plain, */*" },
    ...(next ? { next } : { cache: "no-store" }),
  });

  if (!res.ok) {
    throw new FirmsHttpError(`FIRMS request failed with status ${res.status}`, res.status, url);
  }

  return parseFirmsDetectionsCsv(await res.text());
}

export async function fetchGlobalNoaa20Detections(
  init?: Omit<FetchFirmsDetectionsOptions, keyof FirmsAreaCsvQuery>,
): Promise<FirmsDetection[]> {
  return fetchFirmsDetections({
    ...init,
    source: DEFAULT_FIRMS_SOURCE,
    area: DEFAULT_FIRMS_AREA,
    dayRange: DEFAULT_FIRMS_DAY_RANGE,
  });
}
