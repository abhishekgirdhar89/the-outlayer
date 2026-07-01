import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SaveFlash } from "@/components/admin/SaveFlash";
import { adminListPostCategories } from "@/lib/admin-data";
import { savePostCategory, deletePostCategory } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories — The Outlayer Admin" };

export default async function CategoriesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;

  let categories;
  try {
    categories = await adminListPostCategories();
  } catch (e) {
    return (
      <AdminShell active="posts" title="Categories">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="posts"
      title="Article categories"
      subtitle="The categories authors can pick when writing a post. Independent of Services."
      actions={
        <Link className="btn btn-ghost-dk" href="/admin/posts">
          ← Back to posts
        </Link>
      }
    >
      <SaveFlash saved={saved} deleted={deleted} />

      <div className="admin-card">
        <h3 className="sec-title">Add a category</h3>
        <form action={savePostCategory}>
          <div className="fld-row">
            <div className="fld">
              <label>Name</label>
              <input name="name" required placeholder="e.g. AI in practice" />
            </div>
            <div className="fld">
              <label>Sort order</label>
              <input name="sort_order" type="number" defaultValue={categories.length + 1} />
            </div>
          </div>
          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">Add category</button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Order</th><th></th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  <form action={savePostCategory} style={{ display: "flex", gap: 10 }}>
                    <input type="hidden" name="id" value={c.id} />
                    <input name="name" defaultValue={c.name} style={{ maxWidth: 240 }} />
                    <input type="hidden" name="sort_order" value={c.sort_order} />
                    <button className="linklike" type="submit">Save</button>
                  </form>
                </td>
                <td>
                  <form action={savePostCategory} style={{ display: "flex", gap: 10 }}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="name" value={c.name} />
                    <input name="sort_order" type="number" defaultValue={c.sort_order} style={{ width: 80 }} />
                    <button className="linklike" type="submit">Set</button>
                  </form>
                </td>
                <td>
                  <div className="row-actions">
                    <DeleteButton id={c.id} action={deletePostCategory} confirmText={`Delete category “${c.name}”? Posts already using it keep the label until you re-tag them.`} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} style={{ padding: 16, opacity: 0.7 }}>No categories yet — add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
