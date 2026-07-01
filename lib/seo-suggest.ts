// Rule-based SEO suggestion — derives meta title/description/keywords from the
// content itself. No external API, no key, no cost; runs instantly in the browser.

const BRAND = "The Outlayer";

// Common words to exclude from keyword extraction.
const STOPWORDS = new Set(
  ("a about above after again against all am an and any are aren't as at be because been before being below between both but by can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves just also into your our their they them then than get got getting make makes made like really much many one two three new use used using need needs way ways thing things lot").split(
    /\s+/,
  ),
);

export type SeoSuggestion = { title: string; description: string; keywords: string };

const collapse = (s?: string) => (s || "").replace(/\s+/g, " ").trim();

/** Trim to `max` chars on a word boundary, adding an ellipsis when cut. */
function trimTo(text: string, max: number): string {
  const t = collapse(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–-]+$/, "") + "…";
}

/** Meta title: the title, with the brand appended when it fits under ~60 chars. */
function buildTitle(title: string, fallback: string): string {
  const base = collapse(title) || collapse(fallback) || BRAND;
  if (base.toLowerCase().includes(BRAND.toLowerCase())) return trimTo(base, 60);
  const withBrand = `${base} — ${BRAND}`;
  return withBrand.length <= 60 ? withBrand : trimTo(base, 60);
}

/** Meta description: the excerpt, else the opening of the body, ~155 chars. */
function buildDescription(excerpt: string, body: string, title: string): string {
  const source = collapse(excerpt) || collapse(body) || collapse(title);
  return trimTo(source, 155);
}

/** Keywords: the most frequent significant words in the content. */
function buildKeywords(text: string, count = 7): string {
  const freq = new Map<string, number>();
  for (const raw of collapse(text).toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length < 4 || STOPWORDS.has(raw) || /^\d+$/.test(raw)) continue;
    freq.set(raw, (freq.get(raw) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(([word]) => word)
    .join(", ");
}

/** Build SEO metadata from whatever content is available. */
export function suggestSeo(input: { title?: string; excerpt?: string; body?: string }): SeoSuggestion {
  const title = collapse(input.title);
  const excerpt = collapse(input.excerpt);
  const body = collapse(input.body);
  if (!title && !excerpt && !body) {
    throw new Error("Add a title or some content first, then click Suggest.");
  }
  return {
    title: buildTitle(title, body),
    description: buildDescription(excerpt, body, title),
    keywords: buildKeywords([title, excerpt, body].join(" ")),
  };
}
