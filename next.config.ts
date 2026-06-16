import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin image uploads go through Server Actions; the default 1MB cap is too
      // small for photos. Allow up to 10MB (the `media` bucket caps each file at 5MB).
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
