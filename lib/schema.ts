import type { SiteSettings, Post, ServiceFaq } from "./types";

/**
 * schema.org node builders. Everything is emitted inside a single @graph per page
 * with stable @id references, so Google/LLMs can resolve the practice + person
 * across pages. Server-rendered via <JsonLd>.
 */

type Node = Record<string, unknown>;

const PERSON_ID = "#abhishek";
const PRACTICE_ID = "#practice";
const WEBSITE_ID = "#website";

/** The practice (Organization/ProfessionalService), its founder, and the website —
 *  reused on every page so the entity graph is consistent site-wide. */
export function orgNodes(base: string, settings: SiteSettings): Node[] {
  const brand = settings.brand_name || "The Outlayer";
  const img = (settings.default_og_image || "").trim();
  const handle = (settings.twitter_handle || "").trim().replace(/^@/, "");

  // Social profiles that identify the same entity (LinkedIn first; X only if set).
  const sameAs: string[] = [];
  if ((settings.linkedin_url || "").trim()) sameAs.push(settings.linkedin_url.trim());
  if (handle) sameAs.push(`https://x.com/${handle}`);
  const sameAsProp = sameAs.length ? { sameAs } : {};

  const org: Node = {
    "@type": ["ProfessionalService", "Organization"],
    "@id": `${base}/${PRACTICE_ID}`,
    name: brand,
    url: `${base}/`,
    description:
      "The independent fractional-CMO consulting practice of Abhishek Girdhar — strategy, growth, brand & go-to-market, and AI systems for founders and operators.",
    slogan: "Strategy that gets built.",
    founder: { "@id": `${base}/${PERSON_ID}` },
    ...(img ? { image: img, logo: img } : {}),
    ...(settings.contact_email ? { email: settings.contact_email } : {}),
    ...sameAsProp,
  };

  const person: Node = {
    "@type": "Person",
    "@id": `${base}/${PERSON_ID}`,
    name: "Abhishek Girdhar",
    jobTitle: "Fractional CMO & Independent Consultant",
    url: `${base}/`,
    worksFor: { "@id": `${base}/${PRACTICE_ID}` },
    ...sameAsProp,
  };

  const website: Node = {
    "@type": "WebSite",
    "@id": `${base}/${WEBSITE_ID}`,
    url: `${base}/`,
    name: brand,
    publisher: { "@id": `${base}/${PRACTICE_ID}` },
  };

  return [org, person, website];
}

export function breadcrumb(items: { name: string; url: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** A single service/offer. `provider` points at the practice node in the same graph. */
export function serviceNode(base: string, opts: { slug: string; name: string; description: string }): Node {
  return {
    "@type": "Service",
    "@id": `${base}/services/${opts.slug}#service`,
    name: opts.name,
    serviceType: opts.name,
    url: `${base}/services/${opts.slug}`,
    description: opts.description,
    provider: { "@id": `${base}/${PRACTICE_ID}` },
    areaServed: { "@type": "Place", name: "Worldwide" },
    audience: { "@type": "Audience", audienceType: "Founders and operators" },
  };
}

/** BlogPosting for an insights article. */
export function articleNode(base: string, post: Post): Node {
  const img = (post.og_image || post.cover_image_url || "").trim();
  return {
    "@type": "BlogPosting",
    "@id": `${base}/insights/${post.slug}#article`,
    headline: post.title,
    description: post.meta_description || post.excerpt,
    url: `${base}/insights/${post.slug}`,
    ...(img ? { image: img } : {}),
    datePublished: post.published_at || post.created_at || undefined,
    dateModified: post.published_at || post.created_at || undefined,
    author: { "@id": `${base}/${PERSON_ID}` },
    publisher: { "@id": `${base}/${PRACTICE_ID}` },
    ...(post.category ? { articleSection: post.category } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/insights/${post.slug}` },
  };
}

/** FAQPage from a list of Q&As. */
export function faqNode(base: string, slug: string, faqs: ServiceFaq[]): Node {
  return {
    "@type": "FAQPage",
    "@id": `${base}/services/${slug}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function graph(nodes: Node[]): object {
  return { "@context": "https://schema.org", "@graph": nodes };
}
