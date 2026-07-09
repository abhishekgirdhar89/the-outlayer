import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SaveFlash } from "@/components/admin/SaveFlash";
import { Repeater } from "@/components/admin/Repeater";
import { PanelsEditor } from "@/components/admin/PanelsEditor";
import { FlowEditor } from "@/components/admin/FlowEditor";
import { adminGetServicePage } from "@/lib/admin-data";
import { saveServicePage } from "../../actions";
import type { ServicePage } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit service page — The Outlayer Admin" };

/** "Show this section on the live page" toggle, placed at the top of a section card.
 *  Unticking hides the whole section without deleting any of its content. */
function SectionToggle({ name, checked, label }: { name: string; checked: boolean; label: string }) {
  return (
    <label className="sec-toggle" style={{ display: "flex", alignItems: "center", gap: 10, margin: "-2px 0 14px" }}>
      <input type="checkbox" name={name} defaultChecked={checked} style={{ width: "auto" }} />
      <span>{label}</span>
    </label>
  );
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function ServicePageEditor({ params, searchParams }: Props) {
  const { slug } = await params;
  const { saved } = await searchParams;

  let page: ServicePage | null;
  try {
    page = await adminGetServicePage(slug);
  } catch (e) {
    return (
      <AdminShell active="service-pages" title="Edit service page">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  if (!page) {
    return (
      <AdminShell active="service-pages" title="Edit service page">
        <div className="flash err">
          No page found for “{slug}”. Run the latest <code>supabase/schema.sql</code> to seed it.
        </div>
        <Link className="btn btn-ghost-dk" href="/admin/service-pages">← Back</Link>
      </AdminShell>
    );
  }

  const p = page;
  const rows = <T,>(v: T[]) => v as unknown as Record<string, string>[];

  return (
    <AdminShell
      active="service-pages"
      title={`Edit — ${p.title || p.slug}`}
      subtitle={`/services/${p.slug} · SEO / meta for this page is in the SEO / Meta tab.`}
      actions={
        <Link className="btn btn-ghost-dk" href={`/services/${p.slug}`} target="_blank" style={{ padding: "9px 16px", fontSize: 13 }}>
          View page ↗
        </Link>
      }
    >
      <SaveFlash saved={saved} />

      <form action={saveServicePage}>
        <input type="hidden" name="slug" value={p.slug} />

        {/* ---- Page settings ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Page</h3>
          <div className="fld-row">
            <div className="fld">
              <label>Title (offer name — also the lead “source”)</label>
              <input name="title" defaultValue={p.title} required />
            </div>
            <div className="fld">
              <label>Sort order</label>
              <input name="sort_order" type="number" defaultValue={p.sort_order} />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0 16px" }}>
            <input type="checkbox" name="published" defaultChecked={p.published} style={{ width: "auto" }} />
            <span>Published (visible at /services/{p.slug})</span>
          </label>
          <div className="fld-row">
            <div className="fld">
              <label>Nav “back” label</label>
              <input name="nav_back_label" defaultValue={p.nav_back_label} />
            </div>
            <div className="fld">
              <label>Nav “back” link</label>
              <input name="nav_back_href" defaultValue={p.nav_back_href} placeholder="/#services" />
            </div>
          </div>
        </div>

        {/* ---- Header "Practice" menu ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Header “Practice” menu</h3>
          <p className="hint" style={{ marginBottom: 12 }}>
            How this page appears in the header Practice dropdown. Order follows “Sort order” above.
          </p>
          <div className="fld-row">
            <div className="fld">
              <label>Menu label (short)</label>
              <input name="menu_label" defaultValue={p.menu_label} placeholder="Brand & GTM" />
            </div>
            <div className="fld">
              <label>Menu blurb (one line)</label>
              <input name="menu_blurb" defaultValue={p.menu_blurb} placeholder="Positioning and a go-to-market you can run." />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 4px" }}>
            <input type="checkbox" name="is_umbrella" defaultChecked={p.is_umbrella} style={{ width: "auto" }} />
            <span>Show the “UMBRELLA” badge (the top-of-ladder offer)</span>
          </label>
        </div>

        {/* ---- Story panels ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Story panels</h3>
          <p className="hint" style={{ marginBottom: 12 }}>
            The full-screen scroll-story — one panel per screen. Each panel drives a pose of the
            animated graphic. Reorder with ↑ ↓; wrap a word in <code>*asterisks*</code> to accent it blue.
          </p>
          <PanelsEditor name="panels" value={p.panels} />
        </div>

        {/* ---- In plain terms (bridge) ---- */}
        <div className="admin-card">
          <h3 className="sec-title">“In plain terms” bridge (optional)</h3>
          <SectionToggle name="show_plain" checked={p.show_plain} label="Show this section on the live page" />
          <p className="hint" style={{ marginBottom: 12 }}>
            A full-height plain-language section between the story and the form. Untick above to hide it, or leave the heading blank.
          </p>
          <div className="fld-row">
            <div className="fld">
              <label>Kicker</label>
              <input name="plain_tag" defaultValue={p.plain_tag} placeholder="In plain terms" />
            </div>
            <div className="fld">
              <label>Heading</label>
              <input name="plain_head" defaultValue={p.plain_head} placeholder="What a fractional CMO actually is" />
            </div>
          </div>
          <div className="fld">
            <label>Body</label>
            <textarea name="plain_body" defaultValue={p.plain_body} rows={4} />
          </div>
        </div>

        {/* ---- Contact form copy ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Contact form</h3>
          <div className="fld-row">
            <div className="fld">
              <label>Section kicker</label>
              <input name="form_tag" defaultValue={p.form_tag} />
            </div>
            <div className="fld">
              <label>Heading</label>
              <input name="form_head" defaultValue={p.form_head} />
            </div>
          </div>
          <div className="fld">
            <label>Credibility preline (mono/blue, above the form)</label>
            <input name="credibility_preline" defaultValue={p.credibility_preline} placeholder="I've held the whole picture before. Agency P&L, a team of two hundred, five countries." />
          </div>
          <div className="fld-row">
            <div className="fld">
              <label>Message field label</label>
              <input name="form_context_label" defaultValue={p.form_context_label} />
            </div>
            <div className="fld">
              <label>Message field hint</label>
              <input name="form_context_hint" defaultValue={p.form_context_hint} />
            </div>
          </div>
          <div className="fld">
            <label>Message field placeholder</label>
            <textarea name="form_context_placeholder" defaultValue={p.form_context_placeholder} rows={2} />
          </div>
          <div className="fld">
            <label>Fine print (below the button)</label>
            <textarea name="form_note" defaultValue={p.form_note} rows={2} />
          </div>
          <div className="fld-row">
            <div className="fld">
              <label>Confirmation heading</label>
              <input name="form_ack_heading" defaultValue={p.form_ack_heading} />
            </div>
            <div className="fld">
              <label>Confirmation body</label>
              <textarea name="form_ack_body" defaultValue={p.form_ack_body} rows={2} />
            </div>
          </div>
        </div>

        {/* ---- System flow (AI only / optional) ---- */}
        <div className="admin-card">
          <h3 className="sec-title">System-flow diagram (optional)</h3>
          <SectionToggle name="show_flow" checked={p.show_flow} label="Show this section on the live page" />
          <p className="hint" style={{ marginBottom: 12 }}>
            The node-by-node diagram used on the AI page. Tick the box to enable it; grey nodes run
            automatically, “lit” nodes are the human decision points.
          </p>
          <FlowEditor name="flow" value={p.flow} />
        </div>

        {/* ---- How it works ---- */}
        <div className="admin-card">
          <h3 className="sec-title">How it works</h3>
          <SectionToggle name="show_how" checked={p.show_how} label="Show this section on the live page" />
          <div className="fld-row">
            <div className="fld">
              <label>Section kicker</label>
              <input name="how_tag" defaultValue={p.how_tag} />
            </div>
            <div className="fld">
              <label>Heading</label>
              <input name="how_head" defaultValue={p.how_head} />
            </div>
          </div>
          <Repeater
            name="steps"
            label="Steps"
            addLabel="Add step"
            columns={[
              { key: "phase", label: "Phase (e.g. Week 1)" },
              { key: "lead", label: "Bold lead-in" },
              { key: "desc", label: "Description", textarea: true },
            ]}
            value={rows(p.steps)}
          />
        </div>

        {/* ---- Content hub ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Content hub</h3>
          <SectionToggle name="show_hub" checked={p.show_hub} label="Show this section on the live page" />
          <div className="fld-row">
            <div className="fld">
              <label>Section kicker</label>
              <input name="hub_tag" defaultValue={p.hub_tag} />
            </div>
            <div className="fld">
              <label>Heading</label>
              <input name="hub_head" defaultValue={p.hub_head} />
            </div>
          </div>
          <Repeater
            name="cards"
            label="Cards"
            addLabel="Add card"
            columns={[
              { key: "tag", label: "Kicker (e.g. The idea)" },
              { key: "heading", label: "Heading", textarea: true },
              { key: "href", label: "Link", placeholder: "/insights" },
            ]}
            value={rows(p.cards)}
          />
        </div>

        {/* ---- Proof strip ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Proof strip</h3>
          <SectionToggle name="show_proof" checked={p.show_proof} label="Show this section on the live page" />
          <div className="fld">
            <label>Intro line (optional)</label>
            <textarea name="proof_line" defaultValue={p.proof_line} rows={2} />
          </div>
          <Repeater
            name="stats"
            label="Stats"
            addLabel="Add stat"
            hint="value + unit are shown together; a leading $ and the unit are tinted blue."
            columns={[
              { key: "value", label: "Value (e.g. 6 or $5)" },
              { key: "unit", label: "Unit (e.g. × or M)" },
              { key: "label", label: "Label" },
            ]}
            value={rows(p.stats)}
          />
          <div className="fld">
            <label>“Built alongside” label</label>
            <input name="cred_label" defaultValue={p.cred_label} />
            <span className="hint">The scrolling client names come from the shared Clients list.</span>
          </div>
        </div>

        {/* ---- Testimonials ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Testimonials</h3>
          <p className="hint" style={{ marginBottom: 12 }}>
            Uses the shared testimonial cards. The quotes themselves are managed in
            Admin → Testimonials (one CMS list, shared with the homepage).
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 14px" }}>
            <input type="checkbox" name="show_testimonials" defaultChecked={p.show_testimonials} style={{ width: "auto" }} />
            <span>Show testimonials on this page</span>
          </label>
          <div className="fld-row">
            <div className="fld">
              <label>Section kicker</label>
              <input name="testimonials_tag" defaultValue={p.testimonials_tag} placeholder="In their words" />
            </div>
            <div className="fld">
              <label>Heading</label>
              <input name="testimonials_head" defaultValue={p.testimonials_head} placeholder="The people who handed over the whole picture." />
            </div>
          </div>
        </div>

        {/* ---- FAQ ---- */}
        <div className="admin-card">
          <h3 className="sec-title">FAQ</h3>
          <SectionToggle name="show_faq" checked={p.show_faq} label="Show this section on the live page" />
          <div className="fld-row">
            <div className="fld">
              <label>Section kicker</label>
              <input name="faq_tag" defaultValue={p.faq_tag} placeholder="Questions people ask" />
            </div>
            <div className="fld">
              <label>Heading</label>
              <input name="faq_head" defaultValue={p.faq_head} placeholder="Fractional CMO, answered" />
            </div>
          </div>
          <Repeater
            name="faqs"
            label="Questions & answers"
            addLabel="Add question"
            columns={[
              { key: "q", label: "Question" },
              { key: "a", label: "Answer", textarea: true },
            ]}
            value={rows(p.faqs)}
          />
        </div>

        {/* ---- Closing CTA ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Closing CTA (optional)</h3>
          <SectionToggle name="show_cta" checked={p.show_cta} label="Show this section on the live page" />
          <p className="hint" style={{ marginBottom: 12 }}>
            A centered closing block whose button expands a second enquiry form in place. Untick above to hide it, or leave the heading blank.
          </p>
          <div className="fld-row">
            <div className="fld">
              <label>Kicker</label>
              <input name="cta_tag" defaultValue={p.cta_tag} placeholder="When you're ready" />
            </div>
            <div className="fld">
              <label>Button label</label>
              <input name="cta_button" defaultValue={p.cta_button} placeholder="Start the conversation" />
            </div>
          </div>
          <div className="fld">
            <label>Heading</label>
            <input name="cta_head" defaultValue={p.cta_head} placeholder="One seat. The whole picture. Held together." />
          </div>
          <div className="fld">
            <label>Sub copy</label>
            <textarea name="cta_sub" defaultValue={p.cta_sub} rows={2} />
          </div>
        </div>

        {/* ---- Umbrella cross-link ---- */}
        <div className="admin-card">
          <h3 className="sec-title">Closing cross-link line (optional)</h3>
          <SectionToggle name="show_umbrella" checked={p.show_umbrella} label="Show this section on the live page" />
          <p className="hint" style={{ marginBottom: 12 }}>
            A closing sentence that points to your other service pages. Write it as plain text and put
            <code> {"{services}"}</code> where the links should appear — the site turns that into tidy links
            to the other pages automatically (e.g. “Brand &amp; GTM, Growth Marketing, and AI Systems”).
            Leave blank to hide this line.
          </p>
          <textarea
            name="umbrella_html"
            defaultValue={p.umbrella_html}
            rows={3}
            placeholder="The pieces this seat holds together — {services}. Each runs on its own; the seat keeps them pointed the same way."
          />
        </div>

        <div className="admin-actions">
          <button className="btn btn-primary" type="submit">Save changes</button>
        </div>
      </form>
    </AdminShell>
  );
}
