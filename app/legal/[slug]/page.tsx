import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { getLegalPage, buildMetadata } from "@/lib/data";
import { formatFullDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) return { title: "Not found — The Outlayer" };
  return buildMetadata({
    title: `${page.title} — The Outlayer`,
    description: `${page.title} for The Outlayer — the independent practice of Abhishek Girdhar.`,
    keywords: "",
    fallbackTitle: `${page.title} — The Outlayer`,
    fallbackDescription: `${page.title} for The Outlayer.`,
    path: `/legal/${slug}`,
  });
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page || !page.published) notFound();

  return (
    <div className="page-legal">
      <SiteHeader />
      <section className="sec">
        <div className="wrap legal-wrap">
          <Link className="legal-back" href="/">
            <span className="arr">←</span> Back to home
          </Link>
          <div className="kick">
            <span className="ln" />
            <span className="t">Legal</span>
          </div>
          <h1 className="legal-h1">{page.title}</h1>
          {page.updated_at && (
            <p className="legal-meta">Last updated on {formatFullDate(page.updated_at)}</p>
          )}
          <div className="d-prose" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </section>
      <SiteFooter />
      <MobileCtaBar />
    </div>
  );
}
