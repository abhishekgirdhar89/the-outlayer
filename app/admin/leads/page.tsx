import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { adminListLeads, adminListLeadStatuses } from "@/lib/admin-data";
import { updateLeadStatus, deleteLead } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries — The Outlayer Admin" };

function fmt(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function LeadsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: "newest" | "oldest" }>;
}) {
  const { status = "all", sort = "newest" } = await searchParams;

  let leads, statuses;
  try {
    [leads, statuses] = await Promise.all([adminListLeads({ status, sort }), adminListLeadStatuses()]);
  } catch (e) {
    return (
      <AdminShell active="leads" title="Enquiries">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  const statusLabels = statuses.map((s) => s.label);

  return (
    <AdminShell
      active="leads"
      title="Enquiries"
      subtitle="Form submissions from the “Get in touch” section."
      actions={
        <Link className="btn btn-ghost-dk" href="/admin/leads/statuses">
          Manage statuses
        </Link>
      }
    >
      <form method="get" className="lead-filters admin-card">
        <div className="fld" style={{ margin: 0 }}>
          <label>Status</label>
          <select name="status" defaultValue={status}>
            <option value="all">All</option>
            {statusLabels.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="fld" style={{ margin: 0 }}>
          <label>Sort</label>
          <select name="sort" defaultValue={sort}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
        <button className="btn btn-ghost-dk" type="submit">Apply</button>
      </form>

      {leads.length === 0 ? (
        <div className="admin-card admin-empty">No enquiries{status !== "all" ? ` with status “${status}”` : ""} yet.</div>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>From</th>
                <th>Message</th>
                <th>Source</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{fmt(l.created_at)}</td>
                  <td>
                    <div className="t-title">{l.name || "—"}</div>
                    <div className="note">
                      <a className="linklike" href={`mailto:${l.email}`}>{l.email}</a>
                      {l.phone ? ` · ${l.phone}` : ""}
                    </div>
                  </td>
                  <td style={{ maxWidth: 320 }}>{l.message}</td>
                  <td>{l.source}</td>
                  <td>
                    <LeadStatusSelect id={l.id} current={l.status} options={statusLabels} action={updateLeadStatus} />
                  </td>
                  <td>
                    <div className="row-actions">
                      <DeleteButton id={l.id} action={deleteLead} confirmText="Delete this enquiry?" />
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
