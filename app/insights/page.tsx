import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SubscribeForm } from "@/components/SubscribeForm";
import { InsightsList } from "@/components/InsightsList";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Reveals } from "@/components/Reveals";
import { getPublishedPosts, getPageSeo, buildMetadata } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("insights");
  return buildMetadata({
    title: seo?.meta_title,
    description: seo?.meta_description,
    keywords: seo?.meta_keywords,
    fallbackTitle: "Insights — The Outlayer",
    fallbackDescription:
      "Strategy, operations, growth, and AI — for people who build. Short reads on the move beneath the obvious.",
  });
}

export default async function InsightsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="page-insights">
      <SiteHeader active="insights" />
      <Reveals />

      {/* HEADER */}
      <section className="lhead">
        <div className="lg" />
        <div className="wrap">
          <div className="lhead-copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li className="sep" aria-hidden="true">
                  /
                </li>
                <li aria-current="page">Insights</li>
              </ol>
            </nav>
            <div className="eyebrow">
              <span className="dot" />
              <span className="mono">Insights</span>
            </div>
            <h1>
              Notes on the <em>second-layer move.</em>
            </h1>
            <p>
              Strategy, operations, growth, and AI — for people who build. Short reads on the move
              beneath the obvious, and what changes when the plan and the work share a desk.
            </p>
          </div>
          <div className="lhead-fig" aria-hidden="true">
            <div className="grid" />
            <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
              <g className="lf-stack">
                <rect className="lf-cardback" x="104" y="36" width="222" height="150" rx="14" />
                <rect className="lf-cardmid" x="88" y="54" width="222" height="150" rx="14" />
                <rect className="lf-cardfront" x="72" y="72" width="222" height="150" rx="14" />
                <rect className="lf-tag" x="246" y="94" width="32" height="12" rx="6" />
                <rect className="lf-title" x="94" y="96" width="126" height="12" rx="4" />
                <rect className="lf-hl" x="92" y="124" width="176" height="15" rx="4" />
                <rect className="lf-line" x="94" y="128" width="164" height="8" rx="4" />
                <rect className="lf-line" x="94" y="150" width="148" height="8" rx="4" />
                <rect className="lf-off" x="94" y="172" width="206" height="9" rx="4" />
                <rect className="lf-line" x="94" y="194" width="108" height="8" rx="4" />
                <rect className="lf-caret" x="208" y="190" width="3" height="16" rx="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <InsightsList posts={posts} />

      {/* CLOSING CTA */}
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
              Schedule a call <span className="arr">→</span>
            </Link>
            <a className="btn btn-ghost-dk" href="#top">
              Read more insights
            </a>
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="sec subscribe" id="subscribe">
        <div className="wrap">
          <SubscribeForm
            heading="The second-layer move, *in your inbox.*"
            body="One email when there's something worth reading — strategy, operations, and AI for people who build. No noise."
            cadence="A note now and then · unsubscribe anytime"
          />
        </div>
      </section>

      <SiteFooter />
      <MobileCtaBar label="Schedule a call" />
    </div>
  );
}
