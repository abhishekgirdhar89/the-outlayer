import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageField } from "@/components/admin/ImageField";
import { adminListClients } from "@/lib/admin-data";
import { saveClient, deleteClient } from "../actions";
import type { Client } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients — The Outlayer Admin" };

function ClientFields({ c }: { c?: Client }) {
  return (
    <>
      <div className="fld-row">
        <div className="fld">
          <label>Name</label>
          <input name="name" defaultValue={c?.name ?? ""} required placeholder="Maruti Suzuki" />
        </div>
        <div className="fld">
          <label>Sort order</label>
          <input name="sort_order" type="number" defaultValue={c?.sort_order ?? 0} />
        </div>
      </div>
      <ImageField
        name="logo_url"
        label="Logo (optional)"
        currentUrl={c?.logo_url ?? ""}
        spec="Logo — transparent PNG/SVG, ~200px tall, max 200KB. Optional — the name shows if empty."
      />
    </>
  );
}

export default async function ClientsAdmin() {
  let clients;
  try {
    clients = await adminListClients();
  } catch (e) {
    return (
      <AdminShell active="clients" title="Clients">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="clients"
      title="Clients"
      subtitle="The scrolling “Built alongside” strip on the homepage."
    >
      <div className="admin-card">
        <h3 className="sec-title">Add a client</h3>
        <form action={saveClient}>
          <ClientFields />
          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">Add client</button>
          </div>
        </form>
      </div>

      {clients.map((c) => (
        <div className="admin-card" key={c.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <strong style={{ fontFamily: "var(--display)" }}>{c.name}</strong>
            <DeleteButton id={c.id} action={deleteClient} label="Delete" />
          </div>
          <form action={saveClient}>
            <input type="hidden" name="id" value={c.id} />
            <ClientFields c={c} />
            <div className="admin-actions">
              <button className="btn btn-ghost-dk" type="submit">Save changes</button>
            </div>
          </form>
        </div>
      ))}
    </AdminShell>
  );
}
