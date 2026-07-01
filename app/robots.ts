import type { MetadataRoute } from "next";
import { getSiteSettings, resolveSiteUrl } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = resolveSiteUrl(settings.site_url);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
