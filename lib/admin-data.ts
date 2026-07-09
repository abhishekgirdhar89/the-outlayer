import { getAdminClient } from "./supabase";
import { HOMEPAGE_DEFAULTS, SITE_DEFAULTS, normalizeServicePage } from "./data";
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
  PostCategory,
  LegalPage,
  ServicePage,
} from "./types";

export async function adminListProjects(): Promise<Project[]> {
  const s = getAdminClient();
  const { data, error } = await s
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
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
  const { data, error } = await s
    .from("posts")
    .select("*")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Trashed (soft-deleted) posts + projects, newest-deleted first. */
export async function adminListTrashedPosts(): Promise<Post[]> {
  const s = getAdminClient();
  const { data, error } = await s
    .from("posts")
    .select("*")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });
  if (error) {
    console.error("adminListTrashedPosts failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function adminListTrashedProjects(): Promise<Project[]> {
  const s = getAdminClient();
  const { data, error } = await s
    .from("projects")
    .select("*")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });
  if (error) {
    console.error("adminListTrashedProjects failed:", error.message);
    return [];
  }
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

export async function adminListPostCategories(): Promise<PostCategory[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("post_categories").select("*").order("sort_order", { ascending: true });
  // Fall back to an empty list if the table doesn't exist yet (pre-migration),
  // so the post editor keeps working.
  if (error) {
    console.error("adminListPostCategories failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function adminListLegalPages(): Promise<LegalPage[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("legal_pages").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("adminListLegalPages failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function adminGetLegalPage(slug: string): Promise<LegalPage | null> {
  const s = getAdminClient();
  const { data, error } = await s.from("legal_pages").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function adminListServicePages(): Promise<ServicePage[]> {
  const s = getAdminClient();
  const { data, error } = await s.from("service_pages").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("adminListServicePages failed:", error.message);
    return [];
  }
  return (data ?? []) as ServicePage[];
}

export async function adminGetServicePage(slug: string): Promise<ServicePage | null> {
  const s = getAdminClient();
  const { data, error } = await s.from("service_pages").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeServicePage(data as Record<string, unknown>) : null;
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
    { slug: "services/fractional-cmo", label: "Service — Fractional CMO" },
    { slug: "services/ai-automation", label: "Service — AI Systems" },
    { slug: "services/go-to-market", label: "Service — Brand & Go-to-Market" },
    { slug: "services/growth-marketing", label: "Service — Growth Marketing" },
  ];
  return pages.map((p) => {
    const row = bySlug.get(p.slug);
    return {
      slug: p.slug,
      label: p.label,
      meta_title: row?.meta_title ?? "",
      meta_description: row?.meta_description ?? "",
      meta_keywords: row?.meta_keywords ?? "",
      og_image: row?.og_image ?? "",
    };
  });
}
