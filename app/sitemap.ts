import type { MetadataRoute } from "next";
import { getPublishedPosts, getSiteSettings, resolveSiteUrl } from "@/lib/data";

// Read posts from the DB at request time so new posts appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = resolveSiteUrl(settings.site_url);
  const posts = await getPublishedPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/insights`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/insights/${post.slug}`,
    lastModified: post.published_at ?? post.created_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
