import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Accent } from "@/components/Accent";
import { ContactForm } from "@/components/service/ContactForm";
import { ClosingCta } from "@/components/service/ClosingCta";
import { Faq } from "@/components/service/Faq";
import { ServicePageMotion } from "@/components/service/ServicePageMotion";
import { LayerStage, ServiceCardIcon, StatValue } from "@/components/service/parts";
import { getServicePage, getServicePages, getSiteSettings, getClients, getTestimonials, getPageSeo, buildMetadata, resolveSiteUrl } from "@/lib/data";
import { getLayerStage } from "@/lib/service-pages";
import { makeCaptcha } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { orgNodes, serviceNode, breadcrumb, faqNode, graph } from "@/lib/schema";

export const dynamic = "force-dynamic";

const FALLBACK_CLIENTS = ["Maruti Suzuki", "LPU", "Mu Sigma", "DishTV", "Fab India", "Lingo Sailor"];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) return { title: "Not found — The Outlayer" };
  const seo = await getPageSeo(`services/${slug}`);
  return buildMetadata({
    title: seo?.meta_title,
    description: seo?.meta_description,
    keywords: seo?.meta_keywords,
    image: seo?.og_image,
    path: `/services/${slug}`,
    fallbackTitle: `${page.title} · The Outlayer`,
    fallbackDescription: page.form_head || "The Outlayer — strategy that gets built.",
  });
}

const dcls = (n: number) => "d" + Math.min(n, 5);

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Build the umbrella line's HTML from a plain-text note. `{services}` expands to
 *  auto-generated links to the sibling pages ("A, B, and C"). User text is escaped;
 *  only the controlled link markup is injected. */
function buildUmbrella(note: string, siblings: { slug: string; label: string }[]): string {
  if (!note.trim()) return "";
  const links = siblings.map((s) => `<a href="/services/${s.slug}">${escHtml(s.label)}</a>`);
  const list =
    links.length <= 1
      ? links.join("")
      : links.length === 2
      ? links.join(" and ")
      : links.slice(0, -1).join(", ") + ", and " + links[links.length - 1];
  if (note.includes("{services}")) return note.split("{services}").map(escHtml).join(list);
  return escHtml(note);
}

export default async function ServicePageRoute({ params }: Props) {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page || !page.published) notFound();

  const [settings, clientRows, allPages, testimonials, seo] = await Promise.all([
    getSiteSettings(),
    getClients(),
    getServicePages(),
    getTestimonials(),
    getPageSeo(`services/${slug}`),
  ]);
  const clientNames = clientRows.length ? clientRows.map((c) => c.name) : FALLBACK_CLIENTS;

  // Structured data (server-rendered): Service, the practice/founder, breadcrumbs, + FAQPage when present.
  const base = resolveSiteUrl(settings.site_url);
  const jsonLd = graph([
    serviceNode(base, {
      slug,
      name: page.title,
      description: (seo?.meta_description || page.form_head || `${page.title} · The Outlayer`).trim(),
    }),
    ...orgNodes(base, settings),
    breadcrumb([
      { name: "Home", url: `${base}/` },
      { name: "Practice", url: `${base}/#services` },
      { name: page.title, url: `${base}/services/${slug}` },
    ]),
    ...(page.faqs.length ? [faqNode(base, slug, page.faqs)] : []),
  ]);

  const stage = getLayerStage(slug);
  const firstCap = page.panels[0]?.cap ?? "";
  const { a: capA, b: capB } = makeCaptcha();

  // Umbrella cross-link: a plain-text note where {services} expands to auto-built
  // links to the sibling service pages. Kept server-rendered (crawlable) HTML.
  const siblings = allPages.filter((sp) => sp.slug !== slug).map((sp) => ({ slug: sp.slug, label: sp.menu_label || sp.title }));
  const umbrellaHtml = buildUmbrella(page.umbrella_html, siblings);

  const formCopy = {
    contextLabel: page.form_context_label,
    contextHint: page.form_context_hint,
    contextPlaceholder: page.form_context_placeholder,
    note: page.form_note,
    ackHeading: page.form_ack_heading,
    ackBody: page.form_ack_body,
  };
  // Whether each optional section renders: it must have content AND not be hidden
  // via its CMS visibility toggle (Admin → Service pages → "Show this section").
  const show = {
    plain: page.show_plain && !!page.plain_head,
    flow: page.show_flow && !!page.flow,
    how: page.show_how && page.steps.length > 0,
    proof: page.show_proof && (page.stats.length > 0 || !!page.proof_line),
    testimonials: page.show_testimonials && testimonials.length > 0,
    faq: page.show_faq && page.faqs.length > 0,
    cta: page.show_cta && !!page.cta_head,
    hub: page.show_hub && page.cards.length > 0,
    umbrella: page.show_umbrella && !!umbrellaHtml,
  };

  // Movement-two background A/B alternation, computed only across sections that
  // actually render (so it stays clean on pages missing/hiding optional sections).
  let _li = 0;
  const lift = () => _li++ % 2 === 0;
  const bg = {
    form: lift(),
    flow: show.flow ? lift() : false,
    how: show.how ? lift() : false,
    proof: show.proof ? lift() : false,
    testimonials: show.testimonials ? lift() : false,
    faq: show.faq ? lift() : false,
    cta: show.cta ? lift() : false,
    hub: show.hub ? lift() : false,
    umbrella: show.umbrella ? lift() : false,
  };

  return (
    <div className="page-services">
      <JsonLd data={jsonLd} />
      <SiteHeader active="services" ctaHref="#start" />

      {/* ===================== MOVEMENT ONE — scroll-story ===================== */}
      <main className="story">
        <LayerStage stage={stage} firstCap={firstCap} />

        {page.panels.map((p, pi) => {
          let d = 0;
          const next = () => dcls(++d);
          const HeadTag = (pi === 0 ? "h1" : "h2") as "h1" | "h2";
          return (
            <section
              key={pi}
              className={`screen${p.rows ? " tall" : ""}`}
              data-story=""
              data-pose={p.pose}
              data-cap={p.cap ?? ""}
            >
              <div className="wrap">
                <div className="s-inner">
                  {p.tag && <p className={`s-tag reveal ${next()}`}>{p.tag}</p>}
                  {p.head &&
                    (p.variant === "open" ? (
                      <p className={`s-open reveal ${next()}`}>
                        <Accent text={p.head} />
                      </p>
                    ) : p.variant === "mid" ? (
                      <h2 className={`s-mid reveal ${next()}`} style={p.rows ? { marginBottom: 34 } : undefined}>
                        <Accent text={p.head} />
                      </h2>
                    ) : (
                      <HeadTag className={`s-head reveal ${next()}`}>
                        <Accent text={p.head} />
                      </HeadTag>
                    ))}
                  {p.sub && (
                    <p className={`s-sub reveal ${next()}`}>
                      <Accent text={p.sub} />
                    </p>
                  )}
                  {p.lines?.map((ln, li) => (
                    <p key={li} className={`s-line${ln.strong ? " strong" : ""} reveal ${next()}`}>
                      <Accent text={ln.text} />
                    </p>
                  ))}
                  {p.rows && (
                    <div className="stages">
                      {p.rows.map((r, ri) => (
                        <div key={ri} className={`stage${r.hot ? " hot" : ""} reveal ${next()}`}>
                          <span className="num">{String(ri + 1).padStart(2, "0")}</span>
                          <div>
                            <div className="st-name">{r.name}</div>
                            <div className="st-break">{r.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {p.cols && (
                    <div className="whofor">
                      <div className={`whocol built reveal ${next()}`}>
                        <h4>Built for</h4>
                        <ul>{p.cols.built.map((t, ci) => <li key={ci}>{t}</li>)}</ul>
                      </div>
                      <div className={`whocol notfor reveal ${next()}`}>
                        <h4>Not for</h4>
                        <ul>{p.cols.notFor.map((t, ci) => <li key={ci}>{t}</li>)}</ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <div className="hero-cue" id="heroCue" aria-hidden="true">
        <span className="lbl">scroll</span>
        <span className="chev" aria-hidden="true" />
      </div>
      <button className="scrollcue" id="scrollCue" type="button" aria-label="Scroll to next">
        <span className="lbl">scroll</span>
        <span className="chev" aria-hidden="true" />
      </button>

      {/* ===================== MOVEMENT TWO — browsable depth ===================== */}

      {/* In plain terms — full-height bridge, holds the graphic in its resolved pose (snap point) */}
      {show.plain && (
        <section className="beyond bridge" data-story data-pose="5" data-cap="one seat, the whole picture">
          <div className="wrap">
            {page.plain_tag && <p className="b-tag reveal d1">{page.plain_tag}</p>}
            <h2 className="b-head reveal d2">{page.plain_head}</h2>
            {/* Blank line(s) in the field become separate paragraphs. */}
            {page.plain_body
              .split(/\n\s*\n/)
              .map((para) => para.trim())
              .filter(Boolean)
              .map((para, i) => (
                <p className="plain-body reveal d3" key={i}>
                  {para}
                </p>
              ))}
          </div>
        </section>
      )}

      {/* Middle form */}
      <section className={`beyond${bg.form ? " lift" : ""}`} id="start">
        <div className="wrap">
          <p className="b-tag reveal r2">{page.form_tag}</p>
          <h2 className="b-head reveal r2">{page.form_head}</h2>
          {page.credibility_preline && <p className="form-preline reveal r2">{page.credibility_preline}</p>}
          <ContactForm
            source={page.title}
            capA={capA}
            capB={capB}
            copy={formCopy}
            bookingUrl={settings.booking_url}
            contactEmail={settings.contact_email}
          />
        </div>
      </section>

      {/* System flow (AI page only) */}
      {show.flow && page.flow && (
        <section className={`beyond${bg.flow ? " lift" : ""}`}>
          <div className="wrap">
            <p className="b-tag reveal r2">{page.flow.tag}</p>
            <h2 className="b-head reveal r2">{page.flow.head}</h2>
            {page.flow.sub && <p className="b-sub reveal r2">{page.flow.sub}</p>}
            <div className="flow reveal r2 d2">
              <div className="flow-caps">
                <span className="flow-cap">{page.flow.capLeft}</span>
                <span className="flow-cap lit">{page.flow.capRight}</span>
              </div>
              <div className="flow-nodes">
                {page.flow.nodes.map((n, ni) => (
                  <div key={ni} className={`fnode${n.lit ? " lit" : ""}`}>
                    <span className="fstat">{n.stat}</span>
                    <div className="fnt">{n.title}</div>
                    <div className="fnd">{n.desc}</div>
                  </div>
                ))}
              </div>
              {page.flow.foot && <div className="flow-foot">{page.flow.foot}</div>}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {show.how && (
        <section className={`beyond${bg.how ? " lift" : ""}`}>
          <div className="wrap">
            <p className="b-tag reveal r2">{page.how_tag}</p>
            <h2 className="b-head reveal r2">{page.how_head}</h2>
            <div className="life reveal r2 d2">
              {page.steps.map((s, si) => (
                <div key={si} className="lifeitem">
                  <div className="ph">{s.phase}</div>
                  <div className="pd">
                    {s.lead && <b>{s.lead}</b>} {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proof strip */}
      {show.proof && (
        <section className={`beyond${bg.proof ? " lift" : ""}`}>
          <div className="wrap">
            {page.proof_line && <p className="proof-pl reveal r2">{page.proof_line}</p>}
            {page.stats.length > 0 && (
              <div className="pstats reveal r2">
                {page.stats.map((s, si) => (
                  <div key={si} className="pstat">
                    <StatValue value={s.value} unit={s.unit} />
                    <div className="lab">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            {clientNames.length > 0 && (
              <div className="cred-strip reveal r2">
                <span className="clab">{page.cred_label}</span>
                <div className="brand-marquee">
                  <div className="brand-track">
                    {[...clientNames, ...clientNames].map((n, i) => (
                      <span key={i} className="bn">{n}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials — shared .quote design, CMS-driven */}
      {show.testimonials && (
        <section className={`beyond${bg.testimonials ? " lift" : ""}`}>
          <div className="wrap">
            <p className="b-tag reveal r2">{page.testimonials_tag}</p>
            <h2 className="b-head reveal r2">{page.testimonials_head}</h2>
            <div className="quotes reveal r2 d2">
              {testimonials.map((t) => (
                <figure className="quote" key={t.id}>
                  <div className="qm" aria-hidden="true">&ldquo;</div>
                  <p>{t.quote}</p>
                  <figcaption className="by">
                    {t.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="av" src={t.image_url} alt={t.name} />
                    ) : (
                      <span className="av" />
                    )}
                    <div>
                      <div className="nm">{t.name}</div>
                      <div className="rl">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {show.faq && (
        <section className={`beyond${bg.faq ? " lift" : ""}`}>
          <Faq tag={page.faq_tag} head={page.faq_head} faqs={page.faqs} />
        </section>
      )}

      {/* Closing CTA — expands a second form in place */}
      {show.cta && (
        <section className={`beyond${bg.cta ? " lift" : ""}`}>
          <div className="wrap">
            <ClosingCta
              tag={page.cta_tag}
              head={page.cta_head}
              sub={page.cta_sub}
              button={page.cta_button}
              source={page.title}
              capA={capA}
              capB={capB}
              copy={formCopy}
              bookingUrl={settings.booking_url}
              contactEmail={settings.contact_email}
            />
          </div>
        </section>
      )}

      {/* Content hub — moved to the end */}
      {show.hub && (
        <section className={`beyond${bg.hub ? " lift" : ""}`}>
          <div className="wrap">
            <p className="b-tag reveal r2">{page.hub_tag}</p>
            <h2 className="b-head reveal r2">{page.hub_head}</h2>
            <div className="cards reveal r2 d2">
              {page.cards.map((c, ci) => (
                <Link key={ci} className="card" href={c.href}>
                  <div className="card-top">
                    <span className="ct">{c.tag}</span>
                    <ServiceCardIcon index={ci} />
                  </div>
                  <p className="ch">{c.heading}</p>
                  <span className="cl">
                    Read <span className="ar">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Umbrella cross-link */}
      {show.umbrella && (
        <section className={`beyond umbrella${bg.umbrella ? " lift" : ""}`}>
          <div className="wrap">
            <p className="umb-line reveal r2" dangerouslySetInnerHTML={{ __html: umbrellaHtml }} />
          </div>
        </section>
      )}

      <SiteFooter />
      <MobileCtaBar label="Start the conversation" href="#start" />
      <ServicePageMotion />
    </div>
  );
}
