import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin image uploads go through Server Actions; the default 1MB cap is too
      // small for photos. Allow up to 10MB (the `media` bucket caps each file at 5MB).
      bodySizeLimit: "10mb",
      // The site is served on both the apex and www. Without this, a form rendered
      // on one host but POSTing across the apex↔www redirect fails Next's Origin
      // check and the action silently does nothing (no save, no error). Allow both.
      allowedOrigins: ["theoutlayer.com", "www.theoutlayer.com", "*.theoutlayer.com"],
    },
  },
};

export default nextConfig;
