import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { adminListServicePages } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service Pages — The Outlayer Admin" };

export default async function ServicePagesAdmin() {
  let pages;
  try {
    pages = await adminListServicePages();
  } catch (e) {
    return (
      <AdminShell active="service-pages" title="Service Pages">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="service-pages"
      title="Service Pages"
      subtitle="The four scroll-story offer pages. Edit every line of copy; SEO / meta for each lives in SEO / Meta."
    >
      {pages.length === 0 && (
        <div className="flash err">
          No service pages found. Run the latest <code>supabase/schema.sql</code> in the Supabase SQL editor to
          create and seed them.
        </div>
      )}

      {pages.map((p) => (
        <div className="admin-card" key={p.slug}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <strong style={{ fontFamily: "var(--display)", fontSize: 17 }}>{p.title || p.slug}</strong>
              <div className="hint" style={{ marginTop: 4 }}>
                /services/{p.slug} · {p.published ? "Published" : "Hidden"} · sort {p.sort_order}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link className="btn btn-ghost-dk" href={`/services/${p.slug}`} target="_blank" style={{ padding: "9px 16px", fontSize: 13 }}>
                View ↗
              </Link>
              <Link className="btn btn-primary" href={`/admin/service-pages/${p.slug}`} style={{ padding: "9px 16px", fontSize: 13 }}>
                Edit content
              </Link>
            </div>
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
