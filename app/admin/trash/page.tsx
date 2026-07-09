import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminListTrashedPosts, adminListTrashedProjects } from "@/lib/admin-data";
import { restorePost, restoreProject, purgePost, purgeProject } from "../actions";
import { formatFullDate } from "@/lib/utils";
import type { Post, Project } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Trash — The Outlayer Admin" };

function Row({
  title,
  meta,
  id,
  restore,
  purge,
}: {
  title: string;
  meta: string;
  id: string;
  restore: (fd: FormData) => void;
  purge: (fd: FormData) => void;
}) {
  return (
    <div className="admin-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <div style={{ minWidth: 0 }}>
        <strong style={{ fontFamily: "var(--display)" }}>{title}</strong>
        <div className="hint" style={{ marginTop: 4 }}>{meta}</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
        <form action={restore}>
          <input type="hidden" name="id" value={id} />
          <button className="btn btn-primary" type="submit" style={{ padding: "9px 16px", fontSize: 13 }}>Restore</button>
        </form>
        <DeleteButton
          id={id}
          action={purge}
          label="Delete permanently"
          confirmText="Permanently delete this? This CANNOT be undone — it will be gone for good."
        />
      </div>
    </div>
  );
}

export default async function TrashAdmin({
  searchParams,
}: {
  searchParams: Promise<{ restored?: string; purged?: string }>;
}) {
  const { restored, purged } = await searchParams;

  let posts: Post[] = [];
  let projects: Project[] = [];
  try {
    [posts, projects] = await Promise.all([adminListTrashedPosts(), adminListTrashedProjects()]);
  } catch (e) {
    return (
      <AdminShell active="trash" title="Trash">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  const empty = posts.length === 0 && projects.length === 0;

  return (
    <AdminShell
      active="trash"
      title="Trash"
      subtitle="Deleted posts and projects. Restore them, or delete permanently."
    >
      {restored && <div className="flash">Restored. It’s live again.</div>}
      {purged && <div className="flash">Permanently deleted.</div>}

      {empty && (
        <div className="admin-card">
          <p className="hint">Trash is empty. Deleted posts and projects will appear here, and can be restored.</p>
          <div style={{ marginTop: 12 }}>
            <Link className="btn btn-ghost-dk" href="/admin/posts" style={{ padding: "9px 16px", fontSize: 13 }}>← Posts</Link>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <>
          <h3 className="sec-title" style={{ marginTop: 8 }}>Posts ({posts.length})</h3>
          {posts.map((p) => (
            <Row
              key={p.id}
              id={p.id}
              title={p.title || "(untitled)"}
              meta={`/insights/${p.slug} · deleted ${formatFullDate(p.deleted_at) || "recently"}`}
              restore={restorePost}
              purge={purgePost}
            />
          ))}
        </>
      )}

      {projects.length > 0 && (
        <>
          <h3 className="sec-title" style={{ marginTop: 20 }}>Projects ({projects.length})</h3>
          {projects.map((p) => (
            <Row
              key={p.id}
              id={p.id}
              title={p.title || "(untitled)"}
              meta={`${p.category || "Project"} · deleted ${formatFullDate(p.deleted_at) || "recently"}`}
              restore={restoreProject}
              purge={purgeProject}
            />
          ))}
        </>
      )}
    </AdminShell>
  );
}
