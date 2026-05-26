export const FIRMS_AREA_CSV_PATH = "/api/area/csv";

export const DEFAULT_FIRMS_SOURCE = "VIIRS_NOAA20_NRT";
export const DEFAULT_FIRMS_AREA = "world";
export const DEFAULT_FIRMS_DAY_RANGE = 1;

export const FIRMS_DETECTION_LIST_LIMIT = 100;

export type FirmsLoadState = "ok" | "missing-key" | "failed";
