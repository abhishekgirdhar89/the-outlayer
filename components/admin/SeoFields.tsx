"use client";

import { useRef, useState } from "react";
import { suggestSeo } from "@/lib/seo-suggest";

/**
 * Meta title / description / keywords inputs with a "Suggest" button that fills
 * all three from the current content. Generation runs locally (no API/key/cost).
 *
 * `source`:
 *   - "post"  → gathers title, excerpt and editor content from the surrounding <form>.
 *   - {context, title} → a fixed description of the page (used on standalone pages).
 */
export function SeoFields({
  source,
  defaults,
}: {
  source: "post" | { context: string; title?: string };
  defaults?: { meta_title?: string; meta_description?: string; meta_keywords?: string };
}) {
  const [title, setTitle] = useState(defaults?.meta_title ?? "");
  const [description, setDescription] = useState(defaults?.meta_description ?? "");
  const [keywords, setKeywords] = useState(defaults?.meta_keywords ?? "");
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  function gatherInput(): { title?: string; excerpt?: string; body?: string } {
    if (typeof source === "object") return { title: source.title, body: source.context };
    const form = rootRef.current?.closest("form");
    if (!form) return {};
    const read = (name: string) =>
      ((form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "").trim();
    // Editor content is HTML in a hidden input — strip tags to plain text.
    const tmp = document.createElement("div");
    tmp.innerHTML = read("content");
    return {
      title: read("title"),
      excerpt: read("excerpt"),
      body: (tmp.textContent || "").replace(/\s+/g, " ").trim().slice(0, 6000),
    };
  }

  function onSuggest() {
    setError("");
    try {
      const s = suggestSeo(gatherInput());
      if (s.title) setTitle(s.title);
      if (s.description) setDescription(s.description);
      if (s.keywords) setKeywords(s.keywords);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Suggestion failed.");
    }
  }

  return (
    <div ref={rootRef}>
      <div className="fld">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <label>Meta title</label>
          <button
            type="button"
            className="btn btn-ghost-dk"
            style={{ padding: "5px 11px", fontSize: 12 }}
            onClick={onSuggest}
          >
            ✨ Suggest
          </button>
        </div>
        <input name="meta_title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Defaults to the title" />
        <span className="hint">Browser tab &amp; search-result heading. ~50–60 characters.</span>
      </div>

      {error && <span className="field-err" style={{ display: "block", marginBottom: 12 }}>{error}</span>}

      <div className="fld">
        <label>Meta description</label>
        <textarea name="meta_description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Defaults to the excerpt" />
        <span className="hint">The snippet under the title in search results. ~150–160 characters.</span>
      </div>

      <div className="fld">
        <label>Meta keywords</label>
        <input name="meta_keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="strategy, positioning, go-to-market" />
        <span className="hint">Comma-separated. Optional.</span>
      </div>
    </div>
  );
}
