/** Two small operands for the form's math CAPTCHA. Generated outside the React
 *  render tree (called from a dynamic server component, fresh per request). */
export function makeCaptcha(): { a: number; b: number } {
  return { a: 1 + Math.floor(Math.random() * 8), b: 1 + Math.floor(Math.random() * 8) };
}

/** Turn a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "Jun 2026" style label from an ISO date/timestamp. */
export function formatMonthYear(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Year only, e.g. "2026". */
export function formatYear(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return String(d.getFullYear());
}

/** Map a category to one of the insights filter keys. */
export function categoryKey(category: string): string {
  const c = (category || "").toLowerCase();
  if (c.includes("ai")) return "ai";
  if (c.includes("growth")) return "growth";
  if (c.includes("op")) return "ops";
  if (c.includes("strategy")) return "strategy";
  return "strategy";
}

/**
 * Insert the cover image as an in-prose lead figure (matching design #3, which
 * places the image after the opening paragraphs rather than as a top banner).
 * Inserts after the 2nd </p> when present, else the 1st, else at the start.
 */
export function injectLeadFigure(html: string, imageUrl: string): string {
  if (!imageUrl) return html;
  const safe = imageUrl.replace(/"/g, "&quot;");
  const fig = `<figure class="d-fig lead-fig"><div class="frame"><img class="img-cover" src="${safe}" alt="" /></div></figure>`;
  const positions: number[] = [];
  const re = /<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && positions.length < 2) positions.push(m.index + m[0].length);
  const idx = positions.length >= 2 ? positions[1] : positions.length === 1 ? positions[0] : -1;
  if (idx === -1) return fig + html;
  return html.slice(0, idx) + fig + html.slice(idx);
}

/**
 * Inject id attributes onto <h2> tags (slugified from their text) and return
 * the patched HTML plus a table-of-contents. Used by the article detail page.
 */
export function buildToc(html: string): { html: string; toc: { id: string; label: string }[] } {
  const toc: { id: string; label: string }[] = [];
  const used = new Set<string>();
  const patched = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs: string, inner: string) => {
    const label = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugify(label) || `section-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-${toc.length + 1}`;
    used.add(id);
    toc.push({ id, label });
    const num = String(toc.length).padStart(2, "0");
    // numbered prefix (design #3) unless the author already added one
    const numbered = /h-no/.test(inner) ? inner : `<span class="h-no">${num}</span>${inner}`;
    const idAttr = /\bid=/.test(attrs) ? "" : ` id="${id}"`;
    return `<h2${attrs}${idAttr}>${numbered}</h2>`;
  });
  return { html: patched, toc };
}
