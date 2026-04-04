import type { NextConfig } from "next";

import "./src/env";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.mapbox.com; connect-src 'self' https://api.mapbox.com https://eonet.gsfc.nasa.gov wss:; worker-src 'self' blob:; img-src 'self' blob: data: https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
