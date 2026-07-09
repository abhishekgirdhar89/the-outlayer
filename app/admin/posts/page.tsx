import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SaveFlash } from "@/components/admin/SaveFlash";
import { adminListPosts } from "@/lib/admin-data";
import { formatMonthYear } from "@/lib/utils";
import { deletePost } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Posts — The Outlayer Admin" };

export default async function PostsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; trashed?: string }>;
}) {
  const { saved, deleted, trashed } = await searchParams;
  let posts;
  try {
    posts = await adminListPosts();
  } catch (e) {
    return (
      <AdminShell active="posts" title="Insights / Posts">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="posts"
      title="Insights / Posts"
      subtitle="Blog posts shown on the Insights page and homepage."
      actions={
        <>
          <a className="btn btn-ghost-dk" href="/admin/export/posts">
            Export
          </a>
          <Link className="btn btn-ghost-dk" href="/admin/posts/categories">
            Categories
          </Link>
          <Link className="btn btn-primary" href="/admin/posts/new">
            New post
          </Link>
        </>
      }
    >
      <SaveFlash saved={saved} deleted={deleted} />
      {trashed && (
        <div className="flash">
          Moved to Trash. <Link href="/admin/trash" style={{ textDecoration: "underline" }}>Restore it from Trash</Link> anytime.
        </div>
      )}
      {posts.length === 0 ? (
        <div className="admin-card admin-empty">No posts yet. Write your first one.</div>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="t-title">
                    {p.title}
                    {p.featured && <span className="badge on" style={{ marginLeft: 8 }}>Featured</span>}
                  </td>
                  <td>{p.category}</td>
                  <td>{formatMonthYear(p.published_at) || "—"}</td>
                  <td>
                    <span className={`badge ${p.published ? "on" : "off"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link className="linklike" href={`/admin/posts/${p.id}`}>
                        Edit
                      </Link>
                      <DeleteButton
                        id={p.id}
                        action={deletePost}
                        confirmText="Move this post to Trash? You can restore it from Trash later."
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
