import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { adminGetLegalPage } from "@/lib/admin-data";
import { saveLegalPage } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit legal page — The Outlayer Admin" };

export default async function EditLegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await adminGetLegalPage(slug);
  if (!page) notFound();

  return (
    <AdminShell active="legal" title="Edit legal page" subtitle={page.title}>
      <form action={saveLegalPage} className="admin-card">
        <input type="hidden" name="slug" value={page.slug} />

        <div className="fld">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={page.title} required />
          <span className="hint">URL: /legal/{page.slug}</span>
        </div>

        <div className="fld">
          <label>Content</label>
          <RichTextEditor name="content" defaultValue={page.content} />
          <span className="hint">Use the toolbar for headings, lists, links, and bold text.</span>
        </div>

        <div className="fld-row">
          <div className="fld">
            <label htmlFor="sort_order">Footer order</label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={page.sort_order} style={{ maxWidth: 120 }} />
          </div>
          <div className="fld" style={{ justifyContent: "end" }}>
            <div className="fld-check">
              <input id="published" name="published" type="checkbox" defaultChecked={page.published} />
              <label htmlFor="published">Published (visible on the site &amp; footer)</label>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <button className="btn btn-primary" type="submit">Save changes</button>
          <Link className="btn btn-ghost-dk" href="/admin/legal">Cancel</Link>
          {page.published && (
            <Link className="linklike" href={`/legal/${page.slug}`} target="_blank">View live ↗</Link>
          )}
        </div>
      </form>
    </AdminShell>
  );
}
