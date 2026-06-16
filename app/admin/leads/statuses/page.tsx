import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminListLeadStatuses } from "@/lib/admin-data";
import { saveLeadStatus, deleteLeadStatus } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lead statuses — The Outlayer Admin" };

export default async function StatusesAdmin() {
  let statuses;
  try {
    statuses = await adminListLeadStatuses();
  } catch (e) {
    return (
      <AdminShell active="leads" title="Lead statuses">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="leads"
      title="Lead statuses"
      subtitle="Custom pipeline stages for enquiries."
      actions={
        <Link className="btn btn-ghost-dk" href="/admin/leads">
          ← Back to enquiries
        </Link>
      }
    >
      <div className="admin-card">
        <h3 className="sec-title">Add a status</h3>
        <form action={saveLeadStatus}>
          <div className="fld-row">
            <div className="fld">
              <label>Label</label>
              <input name="label" required placeholder="e.g. Proposal sent" />
            </div>
            <div className="fld">
              <label>Sort order</label>
              <input name="sort_order" type="number" defaultValue={statuses.length + 1} />
            </div>
          </div>
          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">Add status</button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr><th>Label</th><th>Order</th><th></th></tr>
          </thead>
          <tbody>
            {statuses.map((s) => (
              <tr key={s.id}>
                <td>
                  <form action={saveLeadStatus} style={{ display: "flex", gap: 10 }}>
                    <input type="hidden" name="id" value={s.id} />
                    <input name="label" defaultValue={s.label} style={{ maxWidth: 220 }} />
                    <input type="hidden" name="sort_order" value={s.sort_order} />
                    <button className="linklike" type="submit">Save</button>
                  </form>
                </td>
                <td>
                  <form action={saveLeadStatus} style={{ display: "flex", gap: 10 }}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="label" value={s.label} />
                    <input name="sort_order" type="number" defaultValue={s.sort_order} style={{ width: 80 }} />
                    <button className="linklike" type="submit">Set</button>
                  </form>
                </td>
                <td>
                  <div className="row-actions">
                    <DeleteButton id={s.id} action={deleteLeadStatus} confirmText={`Delete status “${s.label}”?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
