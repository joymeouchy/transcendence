import type { NextConfig } from "next";

// the public site address (https://localhost:8443 locally, the real domain on
// the server), passed in from the root .env by docker-compose
const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://localhost:8443",
);

const nextConfig: NextConfig = {
  // next dev only serves its dev resources (live reload, etc.) to localhost by
  // default; allow the real domain too so the app works when hosted
  allowedDevOrigins: [siteUrl.hostname],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "lh3.googleusercontent.com",
      },
      {
        // uploaded avatars, stored in the Supabase Storage "avatars" bucket
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // older avatars, served by the backend behind Caddy's /api prefix
        protocol: "https",
        hostname: siteUrl.hostname,
        port: siteUrl.port,
        pathname: "/api/uploads/**",
      },
    ],
  },
};

export default nextConfig;
