import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { adminListSubscribers } from "@/lib/admin-data";
import { updateSubscriberStatus, deleteSubscriber } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subscribers — The Outlayer Admin" };

function fmt(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function SubscribersAdmin() {
  let subs;
  try {
    subs = await adminListSubscribers();
  } catch (e) {
    return (
      <AdminShell active="subscribers" title="Subscribers">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  const active = subs.filter((s) => s.status === "Active").length;

  return (
    <AdminShell
      active="subscribers"
      title="Subscribers"
      subtitle={`${subs.length} total · ${active} active`}
    >
      {subs.length === 0 ? (
        <div className="admin-card admin-empty">No subscribers yet.</div>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subscribed</th>
                <th>Email</th>
                <th>Source</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{fmt(s.created_at)}</td>
                  <td className="t-title" style={{ fontFamily: "var(--body)", fontWeight: 500 }}>
                    <a className="linklike" href={`mailto:${s.email}`}>{s.email}</a>
                  </td>
                  <td>{s.source}</td>
                  <td>
                    <LeadStatusSelect
                      id={s.id}
                      current={s.status}
                      options={["Active", "Unsubscribed"]}
                      action={updateSubscriberStatus}
                    />
                  </td>
                  <td>
                    <div className="row-actions">
                      <DeleteButton id={s.id} action={deleteSubscriber} confirmText="Delete this subscriber?" />
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
