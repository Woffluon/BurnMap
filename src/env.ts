import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validates environment variables used by BurnMap at import time.
 * Import this module from `next.config.ts` so misconfiguration fails the build early.
 */
export const env = createEnv({
  server: {
    EONET_API_BASE_URL: z
      .string()
      .url()
      .default("https://eonet.gsfc.nasa.gov/api/v3"),
    EONET_FETCH_REVALIDATE_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .max(86_400)
      .default(300),
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
    EONET_API_BASE_URL: process.env.EONET_API_BASE_URL,
    EONET_FETCH_REVALIDATE_SECONDS: process.env.EONET_FETCH_REVALIDATE_SECONDS,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
  emptyStringAsUndefined: true,
});
