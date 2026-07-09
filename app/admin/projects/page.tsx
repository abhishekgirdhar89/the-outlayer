import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SaveFlash } from "@/components/admin/SaveFlash";
import { adminListProjects } from "@/lib/admin-data";
import { deleteProject } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projects — The Outlayer Admin" };

export default async function ProjectsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; trashed?: string }>;
}) {
  const { saved, deleted, trashed } = await searchParams;
  let projects;
  try {
    projects = await adminListProjects();
  } catch (e) {
    return (
      <AdminShell active="projects" title="Projects">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="projects"
      title="Projects"
      subtitle="Portfolio work shown in the homepage “Proof of work” section."
      actions={
        <Link className="btn btn-primary" href="/admin/projects/new">
          New project
        </Link>
      }
    >
      <SaveFlash saved={saved} deleted={deleted} />
      {trashed && (
        <div className="flash">
          Moved to Trash. <Link href="/admin/trash" style={{ textDecoration: "underline" }}>Restore it from Trash</Link> anytime.
        </div>
      )}
      {projects.length === 0 ? (
        <div className="admin-card admin-empty">No projects yet. Create your first one.</div>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Order</th>
                <th>Featured</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="t-title">{p.title}</td>
                  <td>{p.category || "—"}</td>
                  <td>{p.sort_order}</td>
                  <td>
                    <span className={`badge ${p.featured ? "on" : "off"}`}>
                      {p.featured ? "Featured" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link className="linklike" href={`/admin/projects/${p.id}`}>
                        Edit
                      </Link>
                      <DeleteButton
                        id={p.id}
                        action={deleteProject}
                        confirmText="Move this project to Trash? You can restore it from Trash later."
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
