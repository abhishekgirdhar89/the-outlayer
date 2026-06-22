"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase";
import { resolveImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";

// ---------- form helpers ----------
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";
const int = (f: FormData, k: string, d = 0) => {
  const n = parseInt(String(f.get(k) ?? ""), 10);
  return Number.isFinite(n) ? n : d;
};

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/insights");
}

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

// ============================ PROJECTS ============================
export async function saveProject(formData: FormData) {
  const id = str(formData, "id");
  const title = str(formData, "title");
  const payload = {
    title,
    slug: str(formData, "slug") || slugify(title),
    category: str(formData, "category"),
    summary: str(formData, "summary"),
    description: str(formData, "description"),
    image_url: await resolveImage(formData, "image_url", "projects"),
    featured: bool(formData, "featured"),
    sort_order: int(formData, "sort_order"),
  };
  const supabase = getAdminClient();
  const { error } = id
    ? await supabase.from("projects").update(payload).eq("id", id)
    : await supabase.from("projects").insert(payload);
  fail(error);
  refreshPublic();
  revalidatePath("/admin/projects");
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("projects").delete().eq("id", str(formData, "id"));
  fail(error);
  refreshPublic();
  revalidatePath("/admin/projects");
  redirect("/admin/projects?deleted=1");
}

// ============================ POSTS ============================
export async function savePost(formData: FormData) {
  const id = str(formData, "id");
  const title = str(formData, "title");
  const publishedAt = str(formData, "published_at");
  const payload = {
    title,
    slug: str(formData, "slug") || slugify(title),
    category: str(formData, "category") || "Strategy",
    excerpt: str(formData, "excerpt"),
    content: str(formData, "content"),
    cover_image_url: await resolveImage(formData, "cover_image_url", "posts"),
    author: str(formData, "author") || "Abhishek Girdhar",
    read_minutes: int(formData, "read_minutes", 5),
    published: bool(formData, "published"),
    featured: bool(formData, "featured"),
    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
    meta_title: str(formData, "meta_title"),
    meta_description: str(formData, "meta_description"),
    meta_keywords: str(formData, "meta_keywords"),
  };
  const supabase = getAdminClient();
  const { error } = id
    ? await supabase.from("posts").update(payload).eq("id", id)
    : await supabase.from("posts").insert(payload);
  fail(error);
  refreshPublic();
  revalidatePath("/admin/posts");
  if (payload.slug) revalidatePath(`/insights/${payload.slug}`);
  redirect("/admin/posts?saved=1");
}

export async function deletePost(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("posts").delete().eq("id", str(formData, "id"));
  fail(error);
  refreshPublic();
  revalidatePath("/admin/posts");
  redirect("/admin/posts?deleted=1");
}

// ============================ SERVICES ============================
export async function saveService(formData: FormData) {
  const id = str(formData, "id");
  const payload = {
    number: str(formData, "number"),
    title: str(formData, "title"),
    description: str(formData, "description"),
    link: str(formData, "link"),
    cta_label: str(formData, "cta_label"),
    image_url: await resolveImage(formData, "image_url", "services"),
    sort_order: int(formData, "sort_order"),
  };
  const supabase = getAdminClient();
  const { error } = id
    ? await supabase.from("services").update(payload).eq("id", id)
    : await supabase.from("services").insert(payload);
  fail(error);
  refreshPublic();
  revalidatePath("/admin/services");
  redirect("/admin/services?saved=1");
}

export async function deleteService(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("services").delete().eq("id", str(formData, "id"));
  fail(error);
  refreshPublic();
  revalidatePath("/admin/services");
  redirect("/admin/services?deleted=1");
}

// ============================ TESTIMONIALS ============================
export async function saveTestimonial(formData: FormData) {
  const id = str(formData, "id");
  const payload = {
    quote: str(formData, "quote"),
    name: str(formData, "name"),
    role: str(formData, "role"),
    image_url: await resolveImage(formData, "image_url", "testimonials"),
    sort_order: int(formData, "sort_order"),
  };
  const supabase = getAdminClient();
  const { error } = id
    ? await supabase.from("testimonials").update(payload).eq("id", id)
    : await supabase.from("testimonials").insert(payload);
  fail(error);
  refreshPublic();
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", str(formData, "id"));
  fail(error);
  refreshPublic();
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials?deleted=1");
}

// ============================ HOMEPAGE ============================
export async function saveHomepage(formData: FormData) {
  const payload = {
    id: 1,
    hero_eyebrow: str(formData, "hero_eyebrow"),
    hero_title: str(formData, "hero_title"),
    hero_position: str(formData, "hero_position"),
    hero_subtitle: str(formData, "hero_subtitle"),
    hero_cta1_label: str(formData, "hero_cta1_label"),
    hero_cta1_href: str(formData, "hero_cta1_href"),
    hero_cta2_label: str(formData, "hero_cta2_label"),
    hero_cta2_href: str(formData, "hero_cta2_href"),
    about_kicker: str(formData, "about_kicker"),
    about_heading: str(formData, "about_heading"),
    about_subheading: str(formData, "about_subheading"),
    about_body: str(formData, "about_body"),
    about_employers: str(formData, "about_employers"),
    about_photo_url: await resolveImage(formData, "about_photo_url", "homepage"),
    hero_image_url: await resolveImage(formData, "hero_image_url", "homepage"),
    stat1_value: str(formData, "stat1_value"), stat1_unit: str(formData, "stat1_unit"), stat1_label: str(formData, "stat1_label"),
    stat2_value: str(formData, "stat2_value"), stat2_unit: str(formData, "stat2_unit"), stat2_label: str(formData, "stat2_label"),
    stat3_value: str(formData, "stat3_value"), stat3_unit: str(formData, "stat3_unit"), stat3_label: str(formData, "stat3_label"),
    stat4_value: str(formData, "stat4_value"), stat4_unit: str(formData, "stat4_unit"), stat4_label: str(formData, "stat4_label"),
    services_heading: str(formData, "services_heading"),
    services_lead: str(formData, "services_lead"),
    work_heading: str(formData, "work_heading"),
    work_lead: str(formData, "work_lead"),
    writing_heading: str(formData, "writing_heading"),
    writing_lead: str(formData, "writing_lead"),
    subscribe_heading: str(formData, "subscribe_heading"),
    subscribe_body: str(formData, "subscribe_body"),
    enquiry_eyebrow: str(formData, "enquiry_eyebrow"),
    enquiry_heading: str(formData, "enquiry_heading"),
    enquiry_body: str(formData, "enquiry_body"),
    ack_eyebrow: str(formData, "ack_eyebrow"),
    ack_heading: str(formData, "ack_heading"),
    ack_body: str(formData, "ack_body"),
    ack_echo_label: str(formData, "ack_echo_label"),
    ack_cta_label: str(formData, "ack_cta_label"),
    ack_cta_href: str(formData, "ack_cta_href"),
    ack_contact_email: str(formData, "ack_contact_email"),
    show_hero: bool(formData, "show_hero"),
    show_about: bool(formData, "show_about"),
    show_services: bool(formData, "show_services"),
    show_clients: bool(formData, "show_clients"),
    show_work: bool(formData, "show_work"),
    show_testimonials: bool(formData, "show_testimonials"),
    show_writing: bool(formData, "show_writing"),
    show_enquiry: bool(formData, "show_enquiry"),
    show_subscribe: bool(formData, "show_subscribe"),
  };
  const supabase = getAdminClient();
  const { error } = await supabase.from("homepage").upsert(payload, { onConflict: "id" });
  fail(error);
  refreshPublic();
  revalidatePath("/admin/homepage");
  redirect("/admin/homepage?saved=1");
}

// ============================ CLIENTS (brand strip) ============================
export async function saveClient(formData: FormData) {
  const id = str(formData, "id");
  const payload = {
    name: str(formData, "name"),
    logo_url: await resolveImage(formData, "logo_url", "clients"),
    sort_order: int(formData, "sort_order"),
  };
  const supabase = getAdminClient();
  const { error } = id
    ? await supabase.from("clients").update(payload).eq("id", id)
    : await supabase.from("clients").insert(payload);
  fail(error);
  refreshPublic();
  revalidatePath("/admin/clients");
  redirect("/admin/clients?saved=1");
}

export async function deleteClient(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("clients").delete().eq("id", str(formData, "id"));
  fail(error);
  refreshPublic();
  revalidatePath("/admin/clients");
  redirect("/admin/clients?deleted=1");
}

// ============================ LEAD STATUSES ============================
export async function saveLeadStatus(formData: FormData) {
  const id = str(formData, "id");
  const payload = { label: str(formData, "label"), sort_order: int(formData, "sort_order") };
  const supabase = getAdminClient();
  const { error } = id
    ? await supabase.from("lead_statuses").update(payload).eq("id", id)
    : await supabase.from("lead_statuses").insert(payload);
  fail(error);
  revalidatePath("/admin/leads");
  redirect("/admin/leads/statuses");
}

export async function deleteLeadStatus(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("lead_statuses").delete().eq("id", str(formData, "id"));
  fail(error);
  revalidatePath("/admin/leads");
  redirect("/admin/leads/statuses");
}

// ============================ LEADS ============================
export async function updateLeadStatus(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("leads")
    .update({ status: str(formData, "status") })
    .eq("id", str(formData, "id"));
  fail(error);
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("leads").delete().eq("id", str(formData, "id"));
  fail(error);
  revalidatePath("/admin/leads");
}

// ============================ SUBSCRIBERS ============================
export async function updateSubscriberStatus(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("subscribers")
    .update({ status: str(formData, "status") })
    .eq("id", str(formData, "id"));
  fail(error);
  revalidatePath("/admin/subscribers");
}

export async function deleteSubscriber(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("subscribers").delete().eq("id", str(formData, "id"));
  fail(error);
  revalidatePath("/admin/subscribers");
}

// ============================ SITE SETTINGS (header/footer) ============================
export async function saveSiteSettings(formData: FormData) {
  const payload = {
    id: 1,
    brand_name: str(formData, "brand_name"),
    header_cta_label: str(formData, "header_cta_label"),
    header_cta_href: str(formData, "header_cta_href"),
    footer_tagline: str(formData, "footer_tagline"),
    footer_copyright: str(formData, "footer_copyright"),
  };
  const supabase = getAdminClient();
  const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });
  fail(error);
  revalidatePath("/", "layout");
  redirect("/admin/header-footer?saved=1");
}

export async function saveNavItem(formData: FormData) {
  const id = str(formData, "id");
  const payload = { label: str(formData, "label"), href: str(formData, "href"), sort_order: int(formData, "sort_order") };
  const supabase = getAdminClient();
  const { error } = id
    ? await supabase.from("nav_items").update(payload).eq("id", id)
    : await supabase.from("nav_items").insert(payload);
  fail(error);
  revalidatePath("/", "layout");
  redirect("/admin/header-footer?saved=1");
}

export async function deleteNavItem(formData: FormData) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("nav_items").delete().eq("id", str(formData, "id"));
  fail(error);
  revalidatePath("/", "layout");
  redirect("/admin/header-footer?deleted=1");
}

// ============================ PAGE SEO ============================
export async function savePageSeo(formData: FormData) {
  const payload = {
    slug: str(formData, "slug"),
    meta_title: str(formData, "meta_title"),
    meta_description: str(formData, "meta_description"),
    meta_keywords: str(formData, "meta_keywords"),
  };
  const supabase = getAdminClient();
  const { error } = await supabase.from("page_seo").upsert(payload, { onConflict: "slug" });
  fail(error);
  refreshPublic();
  revalidatePath("/admin/seo");
  redirect("/admin/seo?saved=1");
}
