import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import {
  adminListProjects,
  adminListPosts,
  adminListServices,
  adminListTestimonials,
  adminListLeads,
  adminListSubscribers,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — The Outlayer Admin" };

export default async function AdminDashboard() {
  let stats = { projects: 0, posts: 0, published: 0, services: 0, testimonials: 0, leads: 0, newLeads: 0, subscribers: 0 };
  let configError: string | null = null;

  try {
    const [projects, posts, services, testimonials, leads, subscribers] = await Promise.all([
      adminListProjects(),
      adminListPosts(),
      adminListServices(),
      adminListTestimonials(),
      adminListLeads(),
      adminListSubscribers(),
    ]);
    stats = {
      projects: projects.length,
      posts: posts.length,
      published: posts.filter((p) => p.published).length,
      services: services.length,
      testimonials: testimonials.length,
      leads: leads.length,
      newLeads: leads.filter((l) => l.status === "New").length,
      subscribers: subscribers.length,
    };
  } catch (e) {
    configError = e instanceof Error ? e.message : "Could not reach the database.";
  }

  return (
    <AdminShell active="dashboard" title="Dashboard" subtitle="Manage everything on theoutlayer.com">
      {configError && (
        <div className="flash err">
          <strong>Couldn&apos;t load data.</strong> {configError}
          <br />
          Make sure you&apos;ve run <code>supabase/schema.sql</code> and set{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>.
        </div>
      )}

      <div className="admin-grid">
        <Link href="/admin/projects" className="admin-stat">
          <div className="big">{stats.projects}</div>
          <div className="lab">Projects</div>
        </Link>
        <Link href="/admin/posts" className="admin-stat">
          <div className="big">{stats.published}</div>
          <div className="lab">Published posts</div>
        </Link>
        <Link href="/admin/posts" className="admin-stat">
          <div className="big">{stats.posts}</div>
          <div className="lab">Total posts</div>
        </Link>
        <Link href="/admin/services" className="admin-stat">
          <div className="big">{stats.services}</div>
          <div className="lab">Services</div>
        </Link>
        <Link href="/admin/testimonials" className="admin-stat">
          <div className="big">{stats.testimonials}</div>
          <div className="lab">Testimonials</div>
        </Link>
        <Link href="/admin/leads" className="admin-stat">
          <div className="big">{stats.newLeads}</div>
          <div className="lab">New enquiries</div>
        </Link>
        <Link href="/admin/leads" className="admin-stat">
          <div className="big">{stats.leads}</div>
          <div className="lab">Total enquiries</div>
        </Link>
        <Link href="/admin/subscribers" className="admin-stat">
          <div className="big">{stats.subscribers}</div>
          <div className="lab">Subscribers</div>
        </Link>
      </div>

      <div className="admin-card" style={{ marginTop: "24px" }}>
        <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, marginBottom: 8 }}>
          Quick actions
        </h3>
        <div className="admin-actions">
          <Link className="btn btn-primary" href="/admin/posts/new">
            New post
          </Link>
          <Link className="btn btn-ghost-dk" href="/admin/projects/new">
            New project
          </Link>
          <Link className="btn btn-ghost-dk" href="/admin/homepage">
            Edit homepage
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
