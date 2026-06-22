import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminGetSiteSettings, adminListNavItems } from "@/lib/admin-data";
import { saveSiteSettings, saveNavItem, deleteNavItem } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Header & Footer — The Outlayer Admin" };

export default async function HeaderFooterAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;

  let settings, navItems;
  try {
    [settings, navItems] = await Promise.all([adminGetSiteSettings(), adminListNavItems()]);
  } catch (e) {
    return (
      <AdminShell active="header-footer" title="Header & Footer">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="header-footer" title="Header & Footer" subtitle="Brand, navigation menu, CTA, and footer.">
      {saved && <div className="flash">Saved. Your changes are live across the site.</div>}
      {deleted && <div className="flash">Removed. Your changes are live across the site.</div>}

      {/* BRAND + CTA + FOOTER */}
      <form action={saveSiteSettings}>
        <div className="admin-card">
          <h3 className="sec-title">Brand & header CTA</h3>
          <div className="fld">
            <label>Brand name</label>
            <input name="brand_name" defaultValue={settings.brand_name} />
            <span className="hint">A leading “The” is shown smaller, matching the logo.</span>
          </div>
          <div className="fld-row">
            <div className="fld">
              <label>Header button label</label>
              <input name="header_cta_label" defaultValue={settings.header_cta_label} placeholder="(leave empty to hide)" />
            </div>
            <div className="fld">
              <label>Header button link</label>
              <input name="header_cta_href" defaultValue={settings.header_cta_href} placeholder="/#enquiry" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="sec-title">Footer</h3>
          <div className="fld">
            <label>Tagline</label>
            <input name="footer_tagline" defaultValue={settings.footer_tagline} />
          </div>
          <div className="fld">
            <label>Copyright line</label>
            <input name="footer_copyright" defaultValue={settings.footer_copyright} />
          </div>
        </div>

        <div className="admin-actions">
          <button className="btn btn-primary" type="submit">Save brand & footer</button>
        </div>
      </form>

      {/* NAV MENU ITEMS */}
      <div className="admin-card" style={{ marginTop: 28 }}>
        <h3 className="sec-title">Navigation menu</h3>
        <p className="hint" style={{ marginBottom: 16 }}>
          Links shown in the header (and mobile menu). Use <code>/#about</code> for homepage
          sections, <code>/insights</code> for pages.
        </p>

        {navItems.map((n) => (
          <form action={saveNavItem} className="nav-item-row" key={n.id}>
            <input type="hidden" name="id" value={n.id} />
            <input name="label" defaultValue={n.label} placeholder="Label" />
            <input name="href" defaultValue={n.href} placeholder="/#about" />
            <input name="sort_order" type="number" defaultValue={n.sort_order} style={{ width: 70 }} />
            <button className="linklike" type="submit">Save</button>
            <DeleteButton id={n.id} action={deleteNavItem} confirmText={`Remove “${n.label}” from the menu?`} label="Remove" />
          </form>
        ))}

        <form action={saveNavItem} className="nav-item-row" style={{ marginTop: 14, borderTop: "1px solid var(--bd)", paddingTop: 16 }}>
          <input name="label" placeholder="New label" required />
          <input name="href" placeholder="/#section or /page" required />
          <input name="sort_order" type="number" defaultValue={navItems.length + 1} style={{ width: 70 }} />
          <button className="btn btn-primary" type="submit" style={{ padding: "9px 16px", fontSize: 13 }}>Add item</button>
          <span />
        </form>
      </div>
    </AdminShell>
  );
}
