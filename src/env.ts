import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validates environment variables used by BurnMap at import time.
 * Import this module from `next.config.ts` so misconfiguration fails the build early.
 */
export const env = createEnv({
  server: {
    NASA_FIRMS_MAP_KEY: z.string().min(1).optional(),
    FIRMS_API_BASE_URL: z
      .string()
      .url()
      .default("https://firms.modaps.eosdis.nasa.gov"),
  },
  client: {
    /**
     * Mapbox access token.
     * WARNING: Client-exposed tokens can be misused. Ensure you strict referrer 
     * restrictions (domain whitelisting) on your Mapbox dashboard to prevent abuse.
     */
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1).optional(),
  },
  runtimeEnv: {
    NASA_FIRMS_MAP_KEY: process.env.NASA_FIRMS_MAP_KEY,
    FIRMS_API_BASE_URL: process.env.FIRMS_API_BASE_URL,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
  emptyStringAsUndefined: true,
});
