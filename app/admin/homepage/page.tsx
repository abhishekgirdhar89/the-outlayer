import { AdminShell } from "@/components/AdminShell";
import { ImageField } from "@/components/admin/ImageField";
import { CountField } from "@/components/admin/CountField";
import { adminGetHomepage } from "@/lib/admin-data";
import { saveHomepage } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Homepage — The Outlayer Admin" };

const SECTIONS = [
  ["show_hero", "Hero"],
  ["show_about", "About"],
  ["show_clients", "Clients strip"],
  ["show_services", "Services"],
  ["show_work", "Work / Projects"],
  ["show_testimonials", "Testimonials"],
  ["show_writing", "Insights / Writing"],
  ["show_enquiry", "Get in touch"],
  ["show_subscribe", "Subscribe"],
] as const;

export default async function HomepageAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  let h;
  try {
    h = await adminGetHomepage();
  } catch (e) {
    return (
      <AdminShell active="homepage" title="Homepage">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  const accentHint = "Wrap words in *asterisks* to show them in the blue accent.";

  return (
    <AdminShell active="homepage" title="Homepage" subtitle="Edit copy, images, and which sections appear.">
      {saved && <div className="flash">Saved. Your changes are live.</div>}

      <form action={saveHomepage}>
        {/* SECTION VISIBILITY */}
        <div className="admin-card">
          <h3 className="sec-title">Sections — show / hide</h3>
          <div className="toggle-grid">
            {SECTIONS.map(([key, label]) => (
              <label className="fld-check" key={key}>
                <input type="checkbox" name={key} defaultChecked={h[key as keyof typeof h] as boolean} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* HERO */}
        <div className="admin-card">
          <h3 className="sec-title">Hero</h3>
          <CountField name="hero_eyebrow" label="Eyebrow" defaultValue={h.hero_eyebrow} guide={28} />
          <div className="fld-row">
            <CountField name="hero_title" label="Title" defaultValue={h.hero_title} guide={20} hint="A blue period is added automatically." />
            <CountField name="hero_position" label="Position line" defaultValue={h.hero_position} guide={26} hint={accentHint} />
          </div>
          <CountField name="hero_subtitle" label="Subtitle" defaultValue={h.hero_subtitle} rows={2} guide={140} />
          <ImageField
            name="hero_image_url"
            label="Hero graphic (optional)"
            currentUrl={h.hero_image_url}
            spec="Hero graphic — 1200×600px, max 500KB, PNG/JPG. Leave empty to keep the animated graph."
          />
        </div>

        {/* ABOUT */}
        <div className="admin-card">
          <h3 className="sec-title">About</h3>
          <CountField name="about_kicker" label="Kicker" defaultValue={h.about_kicker} guide={16} />
          <ImageField
            name="about_photo_url"
            label="Profile image"
            currentUrl={h.about_photo_url}
            spec="Profile photo — 900×1100px (portrait), max 500KB, PNG/JPG."
          />
          <CountField name="about_heading" label="Heading" defaultValue={h.about_heading} guide={36} hint={accentHint} />
          <CountField name="about_subheading" label="Subheading" defaultValue={h.about_subheading} rows={2} guide={110} hint={accentHint} />
          <CountField name="about_body" label="Body" defaultValue={h.about_body} rows={3} guide={200} />
        </div>

        {/* STATS */}
        <div className="admin-card">
          <h3 className="sec-title">Stats (4)</h3>
          {([1, 2, 3, 4] as const).map((i) => (
            <div className="fld-row" key={i} style={{ gridTemplateColumns: "100px 80px 1fr" }}>
              <div className="fld">
                <label>Value {i}</label>
                <input name={`stat${i}_value`} defaultValue={h[`stat${i}_value` as keyof typeof h] as string} />
              </div>
              <div className="fld">
                <label>Unit</label>
                <input name={`stat${i}_unit`} defaultValue={h[`stat${i}_unit` as keyof typeof h] as string} />
              </div>
              <div className="fld">
                <label>Label</label>
                <input name={`stat${i}_label`} defaultValue={h[`stat${i}_label` as keyof typeof h] as string} />
              </div>
            </div>
          ))}
        </div>

        {/* SECTION HEADINGS */}
        <div className="admin-card">
          <h3 className="sec-title">Section headings</h3>
          <CountField name="services_heading" label="Services heading" defaultValue={h.services_heading} guide={44} hint={accentHint} />
          <CountField name="services_lead" label="Services lead" defaultValue={h.services_lead} rows={2} guide={80} />
          <CountField name="work_heading" label="Work heading" defaultValue={h.work_heading} guide={32} hint={accentHint} />
          <CountField name="work_lead" label="Work lead" defaultValue={h.work_lead} rows={2} guide={120} />
          <CountField name="writing_heading" label="Writing heading" defaultValue={h.writing_heading} guide={32} hint={accentHint} />
          <CountField name="writing_lead" label="Writing lead" defaultValue={h.writing_lead} rows={2} guide={60} />
        </div>

        {/* GET IN TOUCH */}
        <div className="admin-card">
          <h3 className="sec-title">Get in touch</h3>
          <CountField name="enquiry_eyebrow" label="Eyebrow" defaultValue={h.enquiry_eyebrow} guide={14} />
          <CountField name="enquiry_heading" label="Heading" defaultValue={h.enquiry_heading} guide={34} hint={accentHint} />
          <CountField name="enquiry_body" label="Body" defaultValue={h.enquiry_body} rows={2} guide={110} />
        </div>

        {/* SUBSCRIBE */}
        <div className="admin-card">
          <h3 className="sec-title">Subscribe band</h3>
          <CountField name="subscribe_heading" label="Heading" defaultValue={h.subscribe_heading} guide={34} hint={accentHint} />
          <CountField name="subscribe_body" label="Body" defaultValue={h.subscribe_body} rows={2} guide={130} />
        </div>

        <div className="admin-actions">
          <button className="btn btn-primary" type="submit">Save homepage</button>
        </div>
      </form>
    </AdminShell>
  );
}
