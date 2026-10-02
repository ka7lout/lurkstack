import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Never reuse the client-side Router Cache for dynamic content, so a
    // refresh or navigation after a mutation always reflects the database.
    staleTimes: { dynamic: 0, static: 0 },
  },
  async headers() {
    return [
      {
        // Dynamic, per-request content must never be cached by the browser or CDN.
        source: "/((?!_next/static|_next/image|icon.svg|lurkstack-icon.svg|.*\\.(?:jpg|png|svg|ico)$).*)",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
