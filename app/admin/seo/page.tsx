import { AdminShell } from "@/components/AdminShell";
import { ImageField } from "@/components/admin/ImageField";
import { SeoFields } from "@/components/admin/SeoFields";
import { adminListPageSeo, adminGetSiteSettings } from "@/lib/admin-data";
import { savePageSeo, saveSeoDefaults } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO / Meta — The Outlayer Admin" };

export default async function SeoAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  let pages;
  let settings;
  try {
    [pages, settings] = await Promise.all([adminListPageSeo(), adminGetSiteSettings()]);
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
      subtitle="Page titles, descriptions, social share images & analytics."
    >
      {saved && <div className="flash">Saved. Live on the next page load.</div>}

      {/* ---------- GLOBAL DEFAULTS + ANALYTICS ---------- */}
      <div className="admin-card">
        <h3 className="sec-title">Social &amp; search defaults</h3>
        <p className="hint" style={{ marginBottom: 16 }}>
          Site-wide settings. The default social image is used whenever a page or
          post doesn&apos;t have its own.
        </p>
        <form action={saveSeoDefaults}>
          <div className="fld">
            <label>Site URL</label>
            <input name="site_url" defaultValue={settings.site_url} placeholder="https://theoutlayer.com" />
            <span className="hint">
              Your live domain. Powers canonical links, the sitemap &amp; absolute social-image URLs.
            </span>
          </div>

          <ImageField
            name="default_og_image"
            label="Default social share image"
            currentUrl={settings.default_og_image}
            spec="Default OG image — 1200×630px, max 1MB, PNG/JPG. Shown when sharing any page without its own image."
          />

          <div className="fld">
            <label>LinkedIn profile URL</label>
            <input name="linkedin_url" defaultValue={settings.linkedin_url} placeholder="https://www.linkedin.com/in/abhishekgirdhar" />
            <span className="hint">
              Your LinkedIn profile. Added to the site’s structured data (schema.org <code>sameAs</code>) so search
              engines &amp; LLMs link this site to you.
            </span>
          </div>

          <div className="fld">
            <label>Twitter / X handle</label>
            <input name="twitter_handle" defaultValue={settings.twitter_handle} placeholder="@theoutlayer" />
            <span className="hint">Optional — leave blank if you don’t use X. Used to attribute share cards on X.</span>
          </div>

          <div className="fld">
            <label>Google Analytics measurement ID</label>
            <input name="ga_measurement_id" defaultValue={settings.ga_measurement_id} placeholder="G-XXXXXXXXXX" />
            <span className="hint">
              Paste your GA4 ID (starts with <code>G-</code>). Leave blank to turn analytics off.
            </span>
          </div>

          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">Save defaults</button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ background: "transparent", border: 0, padding: 0, marginBottom: 20 }}>
        <p className="hint" style={{ fontSize: 13 }}>
          Each <strong>blog post</strong> has its own SEO fields in the post editor
          (Insights / Posts → edit a post → “SEO / meta”), and uses its featured
          image as the social share image. The pages below are the standalone pages.
        </p>
      </div>

      {/* ---------- PER-PAGE SEO ---------- */}
      {pages.map((p) => (
        <div className="admin-card" key={p.slug}>
          <h3 className="sec-title">{p.label}</h3>
          <form action={savePageSeo}>
            <input type="hidden" name="slug" value={p.slug} />
            <SeoFields
              source={
                p.slug === "home"
                  ? {
                      title: "The Outlayer — Strategy that gets built",
                      context:
                        "The homepage of The Outlayer — the independent strategy, operations, growth, and AI consulting practice of Abhishek Girdhar for founders and operators.",
                    }
                  : p.slug.startsWith("services/")
                  ? {
                      title: `${p.label.replace(/^Service — /, "")} — The Outlayer`,
                      context: `A service/offer page of The Outlayer (Abhishek Girdhar's fractional-CMO consulting practice): ${p.label.replace(
                        /^Service — /,
                        ""
                      )}. Strategy that gets built, for founders and operators.`,
                    }
                  : {
                      title: "Insights — The Outlayer",
                      context:
                        "The Insights page of The Outlayer — a blog of short reads on strategy, operations, growth, and AI for people who build, by Abhishek Girdhar.",
                    }
              }
              defaults={{
                meta_title: p.meta_title,
                meta_description: p.meta_description,
                meta_keywords: p.meta_keywords,
              }}
            />
            <ImageField
              name="og_image"
              label="Social share image"
              currentUrl={p.og_image}
              spec="Social image — 1200×630px, max 1MB, PNG/JPG. Falls back to the default above if empty."
            />
            <div className="admin-actions">
              <button className="btn btn-primary" type="submit">Save</button>
            </div>
          </form>
        </div>
      ))}
    </AdminShell>
  );
}
