import { AdminShell } from "@/components/AdminShell";
import { adminListPageSeo } from "@/lib/admin-data";
import { savePageSeo } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO / Meta — The Outlayer Admin" };

export default async function SeoAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  let pages;
  try {
    pages = await adminListPageSeo();
  } catch (e) {
    return (
      <AdminShell active="seo" title="SEO / Meta">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="seo"
      title="SEO / Meta"
      subtitle="Page titles, descriptions, and keywords for search engines & social shares."
    >
      {saved && <div className="flash">Saved. Live on the next page load.</div>}

      <div className="admin-card" style={{ background: "transparent", border: 0, padding: 0, marginBottom: 20 }}>
        <p className="hint" style={{ fontSize: 13 }}>
          Each <strong>blog post</strong> has its own SEO fields in the post editor
          (Insights / Posts → edit a post → “SEO / meta”). The pages below are the
          standalone pages.
        </p>
      </div>

      {pages.map((p) => (
        <div className="admin-card" key={p.slug}>
          <h3 className="sec-title">{p.label}</h3>
          <form action={savePageSeo}>
            <input type="hidden" name="slug" value={p.slug} />
            <div className="fld">
              <label>Meta title</label>
              <input name="meta_title" defaultValue={p.meta_title} placeholder="e.g. The Outlayer — Strategy that gets built" />
              <span className="hint">Browser tab &amp; search-result heading. ~50–60 characters.</span>
            </div>
            <div className="fld">
              <label>Meta description</label>
              <textarea name="meta_description" defaultValue={p.meta_description} rows={2} />
              <span className="hint">The snippet under the title in search results. ~150–160 characters.</span>
            </div>
            <div className="fld">
              <label>Meta keywords</label>
              <input name="meta_keywords" defaultValue={p.meta_keywords} placeholder="strategy, operations, AI" />
              <span className="hint">Comma-separated. Optional.</span>
            </div>
            <div className="admin-actions">
              <button className="btn btn-primary" type="submit">Save</button>
            </div>
          </form>
        </div>
      ))}
    </AdminShell>
  );
}
