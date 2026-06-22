import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveals } from "@/components/Reveals";
import { SubscribeForm } from "@/components/SubscribeForm";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Media } from "@/components/Media";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Accent } from "@/components/Accent";
import { ServiceIcon } from "@/components/ServiceIcon";
import {
  getHomepage,
  getFeaturedProjects,
  getServices,
  getTestimonials,
  getPublishedPosts,
  getClients,
  getPageSeo,
  buildMetadata,
} from "@/lib/data";
import { formatYear, makeCaptcha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("home");
  return buildMetadata({
    title: seo?.meta_title,
    description: seo?.meta_description,
    keywords: seo?.meta_keywords,
    fallbackTitle: "The Outlayer — Strategy that gets built · Abhishek Girdhar",
    fallbackDescription:
      "The independent practice of Abhishek Girdhar — strategy, operations and technology for founders and operators.",
  });
}

const FALLBACK_CLIENTS = ["Maruti Suzuki", "LPU", "Mu Sigma", "DishTV", "Fab India", "Lingo Sailor"];

export default async function HomePage() {
  const [home, projects, services, testimonials, posts, clientRows] = await Promise.all([
    getHomepage(),
    getFeaturedProjects(6),
    getServices(),
    getTestimonials(),
    getPublishedPosts(),
    getClients(),
  ]);

  const clientNames = clientRows.length ? clientRows.map((c) => c.name) : FALLBACK_CLIENTS;
  const employers = home.about_employers
    .split(/[\n,]+/)
    .map((e) => e.trim())
    .filter(Boolean);

  // Captcha numbers generated per request (page is dynamic).
  const { a: capA, b: capB } = makeCaptcha();

  // Keep the last word of the hero title with its blue period as one unbreakable unit.
  const heroWords = home.hero_title.trim().split(/\s+/);
  const heroLast = heroWords.pop() ?? "";
  const heroHead = heroWords.join(" ");

  const stats = [
    { value: home.stat1_value, unit: home.stat1_unit, label: home.stat1_label },
    { value: home.stat2_value, unit: home.stat2_unit, label: home.stat2_label },
    { value: home.stat3_value, unit: home.stat3_unit, label: home.stat3_label },
    { value: home.stat4_value, unit: home.stat4_unit, label: home.stat4_label },
  ];

  const recentPosts = posts.slice(0, 3);

  return (
    <div className="page-home">
      <SiteHeader />
      <Reveals />

      {/* HERO */}
      {home.show_hero && (
      <section className="hero" id="top">
        <div className="hero-glow" />
        <div className="wrap">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="dot" />
              <span className="mono">{home.hero_eyebrow}</span>
            </div>
            <h1>
              {heroHead && `${heroHead} `}
              <span className="nb">
                {heroLast}
                <span className="period">.</span>
              </span>
            </h1>
            <p className="pos">
              <Accent text={home.hero_position} />
            </p>
            <p className="sub">{home.hero_subtitle}</p>
            <div className="hero-cta">
              {home.hero_cta1_label && (
                <a className="btn btn-primary" href={home.hero_cta1_href || "#enquiry"}>
                  {home.hero_cta1_label} <span className="arr">→</span>
                </a>
              )}
              {home.hero_cta2_label && (
                <a className="btn btn-ghost-dk" href={home.hero_cta2_href || "#work"}>
                  {home.hero_cta2_label}
                </a>
              )}
            </div>
          </div>
          <div className="hero-figure" aria-hidden="true">
            <div className="grid" />
            {home.hero_image_url ? (
              <div className="hero-graphic">
                <Media src={home.hero_image_url} alt="" />
              </div>
            ) : (
              <div className="trail">
                <svg className="trail-svg" viewBox="0 0 460 520" preserveAspectRatio="xMidYMid meet">
                  <path className="trail-path" d="M50 478 C 190 474, 300 360, 392 108" />
                  <g className="trail-dotg">
                    <animateMotion
                      dur="4.6s"
                      begin="0.3s"
                      fill="freeze"
                      calcMode="spline"
                      keyTimes="0;1"
                      keyPoints="0;1"
                      keySplines="0.42 0 0.3 1"
                      path="M50 478 C 190 474, 300 360, 392 108"
                    />
                    <circle className="trail-glow" r="20" />
                    <circle className="trail-core" r="8" />
                  </g>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ABOUT */}
      {home.show_about && (
      <section className="sec lift" id="about">
        <div className="wrap">
          <div className="kick reveal">
            <span className="n">01</span>
            <span className="ln" />
            <span className="t">{home.about_kicker}</span>
          </div>
          <div className="shead reveal">
            <h2 className="h">
              <Accent text={home.about_heading} />
            </h2>
          </div>

          <div className="about-unit reveal">
            <div className="about-main">
              <div className="about-photo">
                <Media src={home.about_photo_url} alt="Abhishek Girdhar" />
              </div>
              <div className="about-copy">
                <h3>
                  <Accent text={home.about_subheading} />
                </h3>
                {home.about_body
                  .split(/\n+/)
                  .map((para) => para.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
            </div>
            <div className="about-stats">
              {stats.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="big">
                    {s.value}
                    <span className="u">{s.unit}</span>
                  </div>
                  <div className="lab">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {(employers.length > 0 || home.show_clients) && (
            <div className="cred-rows reveal">
              {employers.length > 0 && (
                <div className="cred-strip">
                  <span className="lab">Employers</span>
                  <div className="emp-row">
                    {employers.map((e, i) => (
                      <span className="en" key={i}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {home.show_clients && (
                <div className="cred-strip">
                  <span className="lab">Built alongside</span>
                  <div className="brand-marquee">
                    <div className="brand-track">
                      {[...clientNames, ...clientNames].map((b, i) => (
                        <span className="bn" key={i}>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      )}

      {/* SERVICES */}
      {home.show_services && (
      <section className="sec" id="services">
        <div className="work-grid" />
        <div className="wrap">
          <div className="kick reveal">
            <span className="n">02</span>
            <span className="ln" />
            <span className="t">Practice Areas</span>
          </div>
          <div className="shead reveal">
            <h2 className="h">
              <Accent text={home.services_heading} />
            </h2>
            <p className="lead">{home.services_lead}</p>
          </div>
          <div className="svc-grid">
            {(services.length ? services : FALLBACK_SERVICES).map((s, i) => {
              const card = (
                <>
                  <div className="top">
                    <div className="top-l">
                      <span className="n">{s.number || String(i + 1).padStart(2, "0")}</span>
                      <h3>{s.title}</h3>
                    </div>
                    <ServiceIcon index={i} />
                  </div>
                  <p>{s.description}</p>
                  <span className="more">
                    {s.cta_label || "Know more"} <span className="arr">→</span>
                  </span>
                </>
              );
              return s.link ? (
                <a className="svc reveal" href={s.link} key={s.id ?? i}>
                  {card}
                </a>
              ) : (
                <div className="svc reveal" key={s.id ?? i}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      )}

      {/* WORK / PROJECTS */}
      {home.show_work && projects.length > 0 && (
        <section className="sec lift" id="work">
          <div className="work-grid" />
          <div className="wrap">
            <div className="kick reveal">
              <span className="n">03</span>
              <span className="ln" />
              <span className="t">Proof of work</span>
            </div>
            <div className="work-head">
              <div className="shead reveal">
                <h2 className="h">
                  <Accent text={home.work_heading} />
                </h2>
                <p className="lead">{home.work_lead}</p>
              </div>
            </div>
            <div className="work-list">
              {projects.map((p, i) => (
                <a className="work-row reveal" href="#enquiry" key={p.id}>
                  <div className="thumb">
                    <Media src={p.image_url} alt={p.title} />
                  </div>
                  <div className="scrim" />
                  <span className="no">{String(i + 1).padStart(2, "0")}</span>
                  {p.category && <span className="tag2">{p.category}</span>}
                  <div className="body">
                    <h3>{p.title}</h3>
                    <div className="reveal-more">
                      <span>
                        {p.summary && <p>{p.summary}</p>}
                        <span className="more">
                          Walk me through it <span className="arr">→</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {home.show_testimonials && (
        <section className="sec" id="testimonials">
          <div className="work-grid" />
          <div className="wrap">
            <div className="kick reveal">
              <span className="n">04</span>
              <span className="ln" />
              <span className="t">Kind words</span>
            </div>
            <div className="shead reveal">
              <h2 className="h">
                What people say <em>after the work.</em>
              </h2>
              <p className="lead">A few words from people I&apos;ve built alongside.</p>
            </div>
            <div className="quotes">
              {(testimonials.length ? testimonials : FALLBACK_TESTIMONIALS).map((q, i) => (
                <figure className="quote reveal" key={q.id ?? i}>
                  <div className="qm">&ldquo;</div>
                  <p>{q.quote}</p>
                  <figcaption className="by">
                    {q.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="av" src={q.image_url} alt={q.name} />
                    ) : (
                      <span className="av" />
                    )}
                    <div>
                      <div className="nm">{q.name}</div>
                      <div className="rl">{q.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WRITING / INSIGHTS */}
      {home.show_writing && recentPosts.length > 0 && (
        <section className="sec lift" id="writing">
          <div className="work-grid" />
          <div className="wrap">
            <div className="kick reveal">
              <span className="n">05</span>
              <span className="ln" />
              <span className="t">Insights</span>
            </div>
            <div className="work-head">
              <div className="shead reveal">
                <h2 className="h">
                  <Accent text={home.writing_heading} />
                </h2>
                <p className="lead">{home.writing_lead}</p>
              </div>
              <Link className="btn btn-ghost-dk view-all reveal" href="/insights">
                View all insights <span className="arr">→</span>
              </Link>
            </div>
            <div className="writing">
              {recentPosts.map((post) => (
                <Link className="art reveal" href={`/insights/${post.slug}`} key={post.id}>
                  <div className="art-img">
                    <Media src={post.cover_image_url} alt={post.title} />
                  </div>
                  <div className="art-body">
                    <div className="meta">
                      <span className="cat">{post.category}</span>
                      <span className="date">{formatYear(post.published_at)}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="more">
                      Read article <span className="arr">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ENQUIRY */}
      {home.show_enquiry && (
      <section className="sec enq" id="enquiry">
        <div className="enq-glow" />
        <div className="wrap">
          <div className="enq-grid">
            <div className="reveal">
              <div className="enq-eyebrow">
                <span className="dot" />
                <span className="mono">{home.enquiry_eyebrow}</span>
              </div>
              <h2>
                <Accent text={home.enquiry_heading} />
              </h2>
              <p className="lead2">{home.enquiry_body}</p>
            </div>
            <EnquiryForm
              source="Homepage"
              capA={capA}
              capB={capB}
              ack={{
                eyebrow: home.ack_eyebrow,
                heading: home.ack_heading,
                body: home.ack_body,
                echoLabel: home.ack_echo_label,
                ctaLabel: home.ack_cta_label,
                ctaHref: home.ack_cta_href,
                contactEmail: home.ack_contact_email,
              }}
            />
          </div>
        </div>
      </section>
      )}

      {/* SUBSCRIBE */}
      {home.show_subscribe && (
      <section className="sec lift subscribe" id="subscribe">
        <div className="wrap">
          <SubscribeForm heading={home.subscribe_heading} body={home.subscribe_body} source="Homepage" />
        </div>
      </section>
      )}

      <SiteFooter />
      <MobileCtaBar />
    </div>
  );
}

const FALLBACK_SERVICES = [
  { id: "f1", number: "01", title: "Brand & GTM", description: "Positioning and a go-to-market the whole company can actually run.", link: "", cta_label: "Know more" },
  { id: "f2", number: "02", title: "Growth Marketing", description: "The few channels and moves that actually move the number.", link: "", cta_label: "Know more" },
  { id: "f3", number: "03", title: "AI Automation", description: "Practical AI systems that take real, repeatable work off the team.", link: "", cta_label: "Know more" },
  { id: "f4", number: "04", title: "Marketing Ops", description: "The operating system that lets marketing scale cleanly as you grow.", link: "", cta_label: "Know more" },
];

const FALLBACK_TESTIMONIALS = [
  { id: "t1", quote: "He found the lever the rest of us walked past for a year — then built the thing that pulled it.", name: "Placeholder Name", role: "Founder · SaaS", image_url: "" },
  { id: "t2", quote: "Strategy that didn't stay on a slide. We had the system running inside two weeks.", name: "Placeholder Name", role: "COO · Agency", image_url: "" },
  { id: "t3", quote: "The rare operator who can hold the whole picture and still ship the detail himself.", name: "Placeholder Name", role: "VP Growth · DTC", image_url: "" },
];
