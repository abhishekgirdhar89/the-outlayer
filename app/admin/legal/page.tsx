import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SaveFlash } from "@/components/admin/SaveFlash";
import { adminListLegalPages, adminGetSiteSettings } from "@/lib/admin-data";
import { saveCookieSettings } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Legal & Cookies — The Outlayer Admin" };

export default async function LegalAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;

  let pages;
  let settings;
  try {
    [pages, settings] = await Promise.all([adminListLegalPages(), adminGetSiteSettings()]);
  } catch (e) {
    return (
      <AdminShell active="legal" title="Legal & Cookies">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="legal" title="Legal & Cookies" subtitle="Policy pages and the cookie-consent banner.">
      <SaveFlash saved={saved} deleted={deleted} />

      {/* ---------- COOKIE BANNER ---------- */}
      <div className="admin-card">
        <h3 className="sec-title">Cookie consent banner</h3>
        <form action={saveCookieSettings}>
          <div className="fld-check" style={{ marginBottom: 16 }}>
            <input id="cookie_enabled" name="cookie_enabled" type="checkbox" defaultChecked={settings.cookie_enabled} />
            <label htmlFor="cookie_enabled">Show the cookie banner (recommended for EU/UK visitors)</label>
          </div>
          <div className="fld">
            <label>Banner message</label>
            <textarea name="cookie_message" defaultValue={settings.cookie_message} rows={3} />
            <span className="hint">
              Shown with Decline / Accept buttons. A “Cookie Policy” link is appended automatically,
              so end the message with something like “…Read our”. Analytics only loads after Accept.
            </span>
          </div>
          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">Save banner</button>
          </div>
        </form>
      </div>

      {/* ---------- LEGAL PAGES ---------- */}
      <div className="admin-card" style={{ background: "transparent", border: 0, padding: 0, marginBottom: 12 }}>
        <p className="hint" style={{ fontSize: 13 }}>
          These pages are linked in the site footer. The seeded text is a starting template —
          edit each one and have it reviewed by a professional before you rely on it.
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="admin-card admin-empty">No legal pages yet. Run the v8 schema migration to seed them.</div>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr><th>Page</th><th>URL</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.slug}>
                  <td>{p.title}</td>
                  <td><span className="mono" style={{ fontSize: 12, opacity: 0.7 }}>/legal/{p.slug}</span></td>
                  <td>{p.published ? "Published" : "Hidden"}</td>
                  <td>
                    <div className="row-actions">
                      <Link className="linklike" href={`/admin/legal/${p.slug}`}>Edit</Link>
                      {p.published && (
                        <Link className="linklike" href={`/legal/${p.slug}`} target="_blank">View ↗</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
