import Link from "next/link";
import { BrandMark, Wordmark } from "./BrandMark";
import { getSiteSettings } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();
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
    </footer>
  );
}
