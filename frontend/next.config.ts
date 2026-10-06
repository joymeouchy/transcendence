import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "lh3.googleusercontent.com",
      },
      {
        // uploaded avatars, served by the backend behind Caddy's /api prefix
        protocol: "https",
        hostname: "localhost",
        port: "8443",
        pathname: "/api/uploads/**",
      },
    ],
  },
};

export default nextConfig;