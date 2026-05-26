import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "./src/env";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.mapbox.com; connect-src 'self' https://api.mapbox.com https://tiles.openfreemap.org https://firms.modaps.eosdis.nasa.gov wss:; worker-src 'self' blob:; img-src 'self' blob: data: https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
