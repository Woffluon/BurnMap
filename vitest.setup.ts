/**
 * Ensures `@t3-oss/env-nextjs` validation passes before any test imports `@/env`.
 */
process.env.EONET_API_BASE_URL = "https://eonet.gsfc.nasa.gov/api/v3";
process.env.EONET_FETCH_REVALIDATE_SECONDS = "300";
