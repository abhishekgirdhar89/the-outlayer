import { getAdminClient } from "./supabase";
import { HOMEPAGE_DEFAULTS, SITE_DEFAULTS } from "./data";
import type {
  Project,
  Post,
  Service,
  Testimonial,
  Homepage,
  Client,
  Lead,
  LeadStatus,
  Subscriber,
  SiteSettings,
  NavItem,
  PageSeo,
} from "./types";

export async function adminListProjects(): Promise<Project[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("projects").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetProject(id: string): Promise<Project | null> {
  const s = getAdminClient();
  const { data } = await s.from("projects").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function adminListPosts(): Promise<Post[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("posts").select("*").order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetPost(id: string): Promise<Post | null> {
  const s = getAdminClient();
  const { data } = await s.from("posts").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function adminListServices(): Promise<Service[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("services").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminListTestimonials(): Promise<Testimonial[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("testimonials").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetHomepage(): Promise<Homepage> {
  const s = getAdminClient();
  const { data } = await s.from("homepage").select("*").eq("id", 1).maybeSingle();
  return { ...HOMEPAGE_DEFAULTS, ...(data ?? {}) };
}

export async function adminListClients(): Promise<Client[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("clients").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminListLeadStatuses(): Promise<LeadStatus[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("lead_statuses").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminListLeads(opts?: { status?: string; sort?: "newest" | "oldest" }): Promise<Lead[]> {
  const s = getAdminClient();
  let q = s.from("leads").select("*");
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status);
  q = q.order("created_at", { ascending: opts?.sort === "oldest" });
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminListSubscribers(): Promise<Subscriber[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("subscribers").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetSiteSettings(): Promise<SiteSettings> {
  const s = getAdminClient();
  const { data } = await s.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { ...SITE_DEFAULTS, ...(data ?? {}) };
}

export async function adminListNavItems(): Promise<NavItem[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("nav_items").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Page SEO rows, always returning home + insights (merged with any DB values). */
export async function adminListPageSeo(): Promise<(PageSeo & { label: string })[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("page_seo").select("*");
  if (error) throw new Error(error.message);
  const bySlug = new Map((data ?? []).map((r) => [r.slug, r]));
  const pages: { slug: string; label: string }[] = [
    { slug: "home", label: "Homepage" },
    { slug: "insights", label: "Insights listing" },
  ];
  return pages.map((p) => {
    const row = bySlug.get(p.slug);
    return {
      slug: p.slug,
      label: p.label,
      meta_title: row?.meta_title ?? "",
      meta_description: row?.meta_description ?? "",
      meta_keywords: row?.meta_keywords ?? "",
    };
  });
}
