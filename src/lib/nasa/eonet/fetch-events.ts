import type { z } from "zod";

import { env } from "@/env";
import { EONET_EVENTS_PATH } from "./constants";
import {
  eonetEventsQuerySchema,
  eonetEventsResponseSchema,
  type EonetEventsQuery,
  type EonetEventsResponse,
} from "./schemas";

/** Thrown when NASA EONET returns a non-OK HTTP status. */
export class EonetHttpError extends Error {
  readonly name = "EonetHttpError";

  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
  }
}

/** Thrown when the response JSON fails {@link eonetEventsResponseSchema} validation. */
export class EonetParseError extends Error {
  readonly name = "EonetParseError";

  constructor(
    message: string,
    readonly zodError: z.ZodError,
  ) {
    super(message);
  }
}

/**
 * Builds query string parameters for the EONET `/events` endpoint from a validated query object.
 *
 * @param query - Strongly typed filters; arrays become comma-separated values per EONET docs.
 * @returns `URLSearchParams` ready to append to `/events`.
 */
export function buildEonetEventsSearchParams(query: EonetEventsQuery): URLSearchParams {
  const parsed = eonetEventsQuerySchema.parse(query);
  const params = new URLSearchParams();

  if (parsed.category?.length) params.set("category", parsed.category.join(","));
  if (parsed.status) params.set("status", parsed.status);
  if (parsed.days !== undefined) params.set("days", String(parsed.days));
  if (parsed.limit !== undefined) params.set("limit", String(parsed.limit));
  if (parsed.source?.length) params.set("source", parsed.source.join(","));
  if (parsed.bbox) params.set("bbox", parsed.bbox.join(","));
  if (parsed.start) params.set("start", parsed.start);
  if (parsed.end) params.set("end", parsed.end);

  return params;
}

export type FetchEonetEventsOptions = EonetEventsQuery & {
  /** Override default `fetch` (e.g. in unit tests). */
  fetchFn?: typeof fetch;
  /** Override Next.js cache behavior; defaults to env-driven `revalidate`. */
  next?: RequestInit["next"];
};

/**
 * Fetches natural events from NASA EONET v3 (`/events`) and validates the response with Zod.
 *
 * @param options - Query filters plus optional `fetch` and Next cache overrides.
 * @returns Parsed {@link EonetEventsResponse}.
 * @throws {@link EonetHttpError} When the HTTP response is not OK.
 * @throws {@link EonetParseError} When JSON does not match {@link eonetEventsResponseSchema}.
 */
export async function fetchEonetEvents(
  options: FetchEonetEventsOptions = {},
): Promise<EonetEventsResponse> {
  const { fetchFn = fetch, next, ...query } = options;
  const base = env.EONET_API_BASE_URL.replace(/\/$/, "");
  const params = buildEonetEventsSearchParams(query);
  const url = `${base}${EONET_EVENTS_PATH}?${params.toString()}`;

  const res = await fetchFn(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: next ?? { revalidate: env.EONET_FETCH_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new EonetHttpError(`EONET request failed with status ${res.status}`, res.status, url);
  }

  const json: unknown = await res.json();
  const parsed = eonetEventsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new EonetParseError("EONET response failed schema validation", parsed.error);
  }

  return parsed.data;
}

/**
 * Convenience preset for BurnMap: open wildfires within the last N days.
 *
 * @param days - Rolling window in days (EONET `days` parameter).
 */
export async function fetchOpenWildfires(
  days: number,
  init?: Omit<FetchEonetEventsOptions, keyof EonetEventsQuery>,
): Promise<EonetEventsResponse> {
  return fetchEonetEvents({
    ...init,
    category: ["wildfires"],
    status: "open",
    days,
  });
}
