import { NavBar, type PracticeMenuItem } from "./NavBar";
import { getSiteSettings, getNavItems, getServicePages } from "@/lib/data";

export async function SiteHeader({ active, ctaHref }: { active?: string; ctaHref?: string }) {
  const [settings, navItems, servicePages] = await Promise.all([
    getSiteSettings(),
    getNavItems(),
    getServicePages(),
  ]);
  const services: PracticeMenuItem[] = servicePages.map((p) => ({
    slug: p.slug,
    label: p.menu_label || p.title,
    blurb: p.menu_blurb,
    umbrella: p.is_umbrella,
  }));
  return (
    <NavBar
      navItems={navItems}
      services={services}
      brandName={settings.brand_name}
      ctaLabel={settings.header_cta_label}
      ctaHref={ctaHref || settings.header_cta_href}
      active={active}
    />
  );
}
