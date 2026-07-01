import { getPublicClient } from "./supabase";
import type { Project, Post, Service, Testimonial, Homepage, Client, SiteSettings, NavItem, PageSeo, LegalPage } from "./types";
import type { Metadata } from "next";

export const SITE_DEFAULTS: SiteSettings = {
  id: 1,
  brand_name: "The Outlayer",
  header_cta_label: "Book a working session",
  header_cta_href: "/#enquiry",
  footer_tagline: "The non-obvious move. · Strategy that gets built.",
  footer_copyright: "© 2026 · Abhishek Girdhar",
  site_url: "https://theoutlayer.com",
  default_og_image: "",
  twitter_handle: "",
  ga_measurement_id: "",
  cookie_enabled: true,
  cookie_title: "We value your privacy",
  cookie_message:
    "We use cookies to understand how this site is used and to improve your experience. Read our",
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

export async function getLegalPages(): Promise<LegalPage[]> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("legal_pages")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getLegalPages failed:", e);
    return [];
  }
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase.from("legal_pages").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (e) {
    console.error("getLegalPage failed:", e);
    return null;
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
  hero_cta1_label: "I need help",
  hero_cta1_href: "#enquiry",
  hero_cta2_label: "See the work",
  hero_cta2_href: "#work",
  about_kicker: "About Abhishek",
  about_heading: "An operator who *thinks and builds.*",
  about_subheading:
    "Fourteen years inside agencies — in *every seat* from sales to running the whole operation.",
  about_body:
    "The rare advisor who draws the plan and ships the system that makes it real — across marketing, operations, and technology. The background is the proof, not the pitch.",
  about_employers: "Accenture, Google, AdGlobal360, NP Digital",
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
  ack_eyebrow: "Received",
  ack_heading: "Got it, {name} — thank you.",
  ack_body:
    "Your note is in, and your details are saved. The next step is a short working session — pick a time that suits you.",
  ack_echo_label: "What you sent",
  ack_cta_label: "Pick a time on Calendly",
  ack_cta_href: "",
  ack_contact_email: "hello@theoutlayer.com",
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

export async function getPageSeo(slug: string): Promise<PageSeo | null> {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase.from("page_seo").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (e) {
    console.error("getPageSeo failed:", e);
    return null;
  }
}

/** Normalize the configured site URL into a valid absolute origin (no trailing slash). */
export function resolveSiteUrl(raw: string | null | undefined): string {
  const fallback = "https://theoutlayer.com";
  const value = (raw || "").trim() || fallback;
  try {
    return new URL(value).origin;
  } catch {
    return fallback;
  }
}

/**
 * Build a Next Metadata object from SEO fields, with fallbacks.
 * Pulls global defaults (site URL, default social image, Twitter handle) from
 * site_settings so OG images resolve to absolute URLs and social cards render.
 */
export async function buildMetadata(opts: {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  fallbackTitle: string;
  fallbackDescription: string;
  image?: string | null;
  /** Path for the canonical URL & og:url, e.g. "/" or "/insights/<slug>". */
  path?: string;
  ogType?: "website" | "article";
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = resolveSiteUrl(settings.site_url);

  const title = (opts.title || "").trim() || opts.fallbackTitle;
  const description = (opts.description || "").trim() || opts.fallbackDescription;
  const keywords = (opts.keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  // Page image → global default → none.
  const image = (opts.image || "").trim() || (settings.default_og_image || "").trim() || "";
  const images = image ? [image] : undefined;
  const handle = (settings.twitter_handle || "").trim();

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: opts.path ? { canonical: opts.path } : undefined,
    openGraph: {
      type: opts.ogType ?? "website",
      title,
      description,
      url: opts.path ?? undefined,
      siteName: settings.brand_name || "The Outlayer",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images,
      creator: handle || undefined,
      site: handle || undefined,
    },
  };
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
