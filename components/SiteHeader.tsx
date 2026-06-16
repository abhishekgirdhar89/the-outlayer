import { NavBar } from "./NavBar";
import { getSiteSettings, getNavItems } from "@/lib/data";

export async function SiteHeader({ active }: { active?: string }) {
  const [settings, navItems] = await Promise.all([getSiteSettings(), getNavItems()]);
  return (
    <NavBar
      navItems={navItems}
      brandName={settings.brand_name}
      ctaLabel={settings.header_cta_label}
      ctaHref={settings.header_cta_href}
      active={active}
    />
  );
}
