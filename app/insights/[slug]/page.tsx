import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Media } from "@/components/Media";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { ShareButtons } from "@/components/ShareButtons";
import { Reveals } from "@/components/Reveals";
import { getPostBySlug, getPublishedPosts, getSiteSettings, buildMetadata, resolveSiteUrl } from "@/lib/data";
import { buildToc, formatMonthYear, injectLeadFigure } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { orgNodes, articleNode, breadcrumb, graph } from "@/lib/schema";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found — The Outlayer" };
  return buildMetadata({
    title: post.meta_title,
    description: post.meta_description,
    keywords: post.meta_keywords,
    fallbackTitle: `${post.title} — The Outlayer`,
    fallbackDescription: post.excerpt,
    image: post.og_image || post.cover_image_url,
    path: `/insights/${post.slug}`,
    ogType: "article",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [all, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  const related = pickRelated(all, post.id, post.category, 3);
  const { html, toc } = buildToc(post.content || "");
  // Design #3 places the cover image inside the prose (after the intro), not as a top banner.
  const proseHtml = injectLeadFigure(html, post.cover_image_url);

  const base = resolveSiteUrl(settings.site_url);
  const jsonLd = graph([
    articleNode(base, post),
    ...orgNodes(base, settings),
    breadcrumb([
      { name: "Home", url: `${base}/` },
      { name: "Insights", url: `${base}/insights` },
      { name: post.title, url: `${base}/insights/${post.slug}` },
    ]),
  ]);

  return (
    <div className="page-post">
      <JsonLd data={jsonLd} />
      <SiteHeader active="insights" />
      <Reveals />

      <article className="detail">
        <div className="wrap">
          <header className="d-head">
            <nav className="crumbs" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li className="sep" aria-hidden="true">/</li>
                <li>
                  <Link href="/insights">Insights</Link>
                </li>
                <li className="sep" aria-hidden="true">/</li>
                <li aria-current="page">{post.title}</li>
              </ol>
            </nav>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="dek">{post.excerpt}</p>}
            <div className="d-byline">
              <span className="by">{post.author}</span>
              <span className="sep" />
              <time dateTime={post.published_at ?? undefined}>
                {formatMonthYear(post.published_at)}
              </time>
              <span className="sep" />
              <span>{post.read_minutes} min read</span>
              <span className="sep" />
              <span>{post.category}</span>
              <ShareButtons title={post.title} />
            </div>
          </header>
        </div>

        <div className="wrap">
          <div className="d-main">
            {/* RAIL */}
            <aside className="d-rail" aria-label="Article contents and actions">
              {toc.length > 0 && (
                <div className="r-block">
                  <div className="r-lbl">On this page</div>
                  <nav className="d-toc" aria-label="Contents">
                    {toc.map((t) => (
                      <a key={t.id} href={`#${t.id}`}>
                        {t.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
              <div className="rail-box accent">
                <div className="rb-eye">Newsletter</div>
                <h4>The second-layer move</h4>
                <p>One email when there&apos;s something worth reading.</p>
                <Link className="btn-mini ghost" href="/insights#subscribe">
                  Subscribe <span className="arr">→</span>
                </Link>
              </div>
              <div className="rail-box">
                <div className="rb-eye">Work together</div>
                <h4>Building something?</h4>
                <p>If this lines up with your work, let&apos;s talk it through.</p>
                <Link className="btn-mini ghost" href="/#enquiry">
                  Start an enquiry <span className="arr">→</span>
                </Link>
              </div>
            </aside>

            {/* BODY */}
            <div className="d-prose" dangerouslySetInnerHTML={{ __html: proseHtml }} />
          </div>

          <div className="d-main" style={{ marginTop: 0 }}>
            <div />
            <div style={{ maxWidth: 704 }}>
              <div className="d-end">
                <span className="d-end-lbl">Share this article</span>
                <ShareButtons title={post.title} />
              </div>
              <aside className="end-byline">
                <div className="eb-text">
                  <span className="eb-eye">Written by </span>
                  <span className="eb-name">
                    {post.author} <span className="eb-role">— Principal, The Outlayer</span>
                  </span>
                </div>
                <Link className="eb-link" href="/#about">
                  About <span className="arr">→</span>
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="related">
          <div className="wrap">
            <div className="r-head">
              <h2>Keep reading</h2>
              <Link className="all" href="/insights">
                All insights <span className="arr">→</span>
              </Link>
            </div>
            <div className="rel-grid">
              {related.map((r) => (
                <Link className="rel" href={`/insights/${r.slug}`} key={r.id}>
                  <div className="rel-img">
                    <Media src={r.cover_image_url} alt={r.title} />
                  </div>
                  <div className="rel-body">
                    <span className="cat">{r.category}</span>
                    <h3>{r.title}</h3>
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

      {/* CTA */}
      <section className="cta">
        <div className="cg" />
        <div className="wrap">
          <h2>
            Have something you&apos;re <span className="u">taking to market?</span>
          </h2>
          <p>
            Tell me where you&apos;re headed in one line. We&apos;ll take it from there over a short
            working session.
          </p>
          <div className="cbtns">
            <Link className="btn btn-primary" href="/#enquiry">
              Schedule a Call <span className="arr">→</span>
            </Link>
            <Link className="btn btn-ghost-dk" href="/insights">
              Read more insights
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileCtaBar label="Schedule a call" />
    </div>
  );
}

function pickRelated(all: Post[], excludeId: string, category: string, n: number): Post[] {
  const others = all.filter((p) => p.id !== excludeId);
  const same = others.filter((p) => p.category === category);
  const merged = [...same, ...others.filter((p) => p.category !== category)];
  return merged.slice(0, n);
}
