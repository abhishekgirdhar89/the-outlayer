import Link from "next/link";
import { BrandMark, Wordmark } from "./BrandMark";
import { ManageCookiesButton } from "./ManageCookiesButton";
import { getSiteSettings, getLegalPages } from "@/lib/data";

export async function SiteFooter() {
  const [settings, legal] = await Promise.all([getSiteSettings(), getLegalPages()]);
  return (
    <footer className="foot">
      <div className="wrap foot-row">
        <Link className="foot-lk" href="/">
          <BrandMark size={24} />
          <Wordmark name={settings.brand_name} />
        </Link>
        <span className="mono">{settings.footer_tagline}</span>
        <span className="mono">{settings.footer_copyright}</span>
      </div>
      {(legal.length > 0 || settings.cookie_enabled) && (
        <div className="wrap foot-legal">
          <div className="foot-legal-links">
            {legal.map((p) => (
              <Link key={p.slug} className="foot-legal-lk" href={`/legal/${p.slug}`}>
                {p.title}
              </Link>
            ))}
          </div>
          {settings.cookie_enabled && <ManageCookiesButton />}
        </div>
      )}
    </footer>
  );
}
