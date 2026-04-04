/**
 * Default rolling window (in days) for open wildfire incidents shown on the home view.
 * Maps to the EONET `days` query parameter.
 */
export const DEFAULT_WILDFIRE_DAYS = 30;

/**
 * Path segment for the EONET events JSON endpoint, appended to `EONET_API_BASE_URL`.
 */
export const EONET_EVENTS_PATH = "/events" as const;
