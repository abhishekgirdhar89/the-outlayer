import type { MetadataRoute } from "next";
import { getPublishedPosts, getServicePages, getSiteSettings, resolveSiteUrl } from "@/lib/data";

// Read posts from the DB at request time so new posts appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = resolveSiteUrl(settings.site_url);
  const [posts, servicePages] = await Promise.all([getPublishedPosts(), getServicePages()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/insights`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = servicePages.map((p) => ({
    url: `${base}/services/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/insights/${post.slug}`,
    lastModified: post.published_at ?? post.created_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
