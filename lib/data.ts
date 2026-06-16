import { getPublicClient } from "./supabase";
import type { Project, Post, Service, Testimonial, Homepage, Client, SiteSettings, NavItem } from "./types";

export const SITE_DEFAULTS: SiteSettings = {
  id: 1,
  brand_name: "The Outlayer",
  header_cta_label: "Book a working session",
  header_cta_href: "/#enquiry",
  footer_tagline: "The non-obvious move. · Strategy that gets built.",
  footer_copyright: "© 2026 · Abhishek Girdhar",
};

export const NAV_DEFAULTS: NavItem[] = [
  { id: "d1", label: "About", href: "/#about", sort_order: 1 },
  { id: "d2", label: "Practice", href: "/#services", sort_order: 2 },
  { id: "d3", label: "Work", href: "/#work", sort_order: 3 },
  { id: "d4", label: "Insights", href: "/insights", sort_order: 4 },
];

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return { ...SITE_DEFAULTS, ...(data ?? {}) };
  } catch (e) {
    console.error("getSiteSettings failed, using defaults:", e);
    return SITE_DEFAULTS;
  }
}

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase.from("nav_items").select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    return data && data.length ? data : NAV_DEFAULTS;
  } catch (e) {
    console.error("getNavItems failed, using defaults:", e);
    return NAV_DEFAULTS;
  }
}

// Always fetch fresh content (this is a CMS — editors expect to see edits immediately).
export const dynamic = "force-dynamic";

/** Defaults mirror the original mockup so pages render fully before the DB is seeded/edited. */
export const HOMEPAGE_DEFAULTS: Homepage = {
  id: 1,
  hero_eyebrow: "AI · Marketing · Operations",
  hero_title: "The non-obvious move",
  hero_position: "Strategy that gets *built.*",
  hero_subtitle:
    "The independent practice of Abhishek Girdhar — strategy, operations and technology, as one motion, for founders and operators.",
  about_kicker: "About Abhishek",
  about_heading: "An operator who *thinks and builds.*",
  about_subheading:
    "Fourteen years inside agencies — in *every seat* from sales to running the whole operation.",
  about_body:
    "The rare advisor who draws the plan and ships the system that makes it real — across marketing, operations, and technology. The background is the proof, not the pitch.",
  about_photo_url: "",
  stat1_value: "14", stat1_unit: "yrs", stat1_label: "Operating across agencies — strategy to delivery.",
  stat2_value: "$5", stat2_unit: "M+", stat2_label: "Operations scaled, with the P&L owned.",
  stat3_value: "5", stat3_unit: "+", stat3_label: "Delivery divisions launched across channels.",
  stat4_value: "30", stat4_unit: "+", stat4_label: "People hired, trained, and led across teams.",
  services_heading: "Four ways I work — *each one, advice that ships.*",
  services_lead: "The short version below. The full scope for each lives on its own page.",
  work_heading: "Proof that strategy *gets built.*",
  work_lead:
    "A few concept builds — how the thinking turns into working systems, mapped to the service each belongs to.",
  writing_heading: "Notes on the *second-layer move.*",
  writing_lead: "Strategy, operations, and AI for people who build.",
  subscribe_heading: "The second layer, *in your inbox.*",
  subscribe_body:
    "One read a week on the move beneath the obvious — strategy, operations, and AI for people who build. No noise.",
  hero_image_url: "",
  enquiry_eyebrow: "Get in touch",
  enquiry_heading: "Let's find the *non-obvious move.*",
  enquiry_body:
    "Tell me where you're headed in one line. We'll take it from there over a short working session.",
  show_hero: true,
  show_about: true,
  show_services: true,
  show_clients: true,
  show_work: true,
  show_testimonials: true,
  show_writing: true,
  show_enquiry: true,
  show_subscribe: true,
};

export async function getHomepage(): Promise<Homepage> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase.from("homepage").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return { ...HOMEPAGE_DEFAULTS, ...(data ?? {}) };
  } catch (e) {
    console.error("getHomepage failed, using defaults:", e);
    return HOMEPAGE_DEFAULTS;
  }
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getFeaturedProjects failed:", e);
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getServices failed:", e);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getTestimonials failed:", e);
    return [];
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getClients failed:", e);
    return [];
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getPublishedPosts failed:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (e) {
    console.error("getPostBySlug failed:", e);
    return null;
  }
}
