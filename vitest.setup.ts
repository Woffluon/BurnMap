/**
 * Ensures `@t3-oss/env-nextjs` validation passes before any test imports `@/env`.
 */
process.env.NASA_FIRMS_MAP_KEY = "TEST_MAP_KEY";
process.env.FIRMS_API_BASE_URL = "https://firms.modaps.eosdis.nasa.gov";
