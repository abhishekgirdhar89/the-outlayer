import Link from "next/link";
import { BrandMark, Wordmark } from "./BrandMark";
import { logout } from "@/app/admin/auth-actions";

const NAV = [
  { href: "/admin", label: "Dashboard", key: "dashboard" },
  { href: "/admin/homepage", label: "Homepage", key: "homepage" },
  { href: "/admin/header-footer", label: "Header & Footer", key: "header-footer" },
  { href: "/admin/seo", label: "SEO / Meta", key: "seo" },
  { href: "/admin/legal", label: "Legal & Cookies", key: "legal" },
  { href: "/admin/projects", label: "Projects", key: "projects" },
  { href: "/admin/posts", label: "Insights / Posts", key: "posts" },
  { href: "/admin/services", label: "Services", key: "services" },
  { href: "/admin/clients", label: "Clients", key: "clients" },
  { href: "/admin/testimonials", label: "Testimonials", key: "testimonials" },
  { href: "/admin/leads", label: "Enquiries", key: "leads" },
  { href: "/admin/subscribers", label: "Subscribers", key: "subscribers" },
];

export function AdminShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  active: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-side">
          <Link className="brand" href="/admin">
            <BrandMark size={24} />
            <Wordmark />
          </Link>
          <nav className="admin-nav">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={active === n.key ? "active" : ""}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="logout admin-nav">
            <Link href="/" target="_blank">
              View site ↗
            </Link>
            <form action={logout}>
              <button className="linklike" type="submit" style={{ padding: "10px 12px" }}>
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-head">
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
