import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageField } from "@/components/admin/ImageField";
import { adminListServices } from "@/lib/admin-data";
import { saveService, deleteService } from "../actions";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services — The Outlayer Admin" };

function ServiceFields({ s }: { s?: Service }) {
  return (
    <>
      <div className="fld-row">
        <div className="fld">
          <label>Number</label>
          <input name="number" defaultValue={s?.number ?? ""} placeholder="01" />
        </div>
        <div className="fld">
          <label>Sort order</label>
          <input name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} />
        </div>
      </div>
      <div className="fld">
        <label>Title</label>
        <input name="title" defaultValue={s?.title ?? ""} required />
      </div>
      <div className="fld">
        <label>Description</label>
        <textarea name="description" defaultValue={s?.description ?? ""} rows={2} />
      </div>
      <div className="fld-row">
        <div className="fld">
          <label>Link (optional)</label>
          <input name="link" defaultValue={s?.link ?? ""} placeholder="/services/brand-gtm" />
        </div>
        <div className="fld">
          <label>CTA label</label>
          <input name="cta_label" defaultValue={s?.cta_label ?? "Know more"} placeholder="Know more" />
        </div>
      </div>
      <ImageField
        name="image_url"
        label="Image (optional)"
        currentUrl={s?.image_url ?? ""}
        spec="Service image — 800×600px, max 1MB, PNG/JPG."
      />
    </>
  );
}

export default async function ServicesAdmin() {
  let services;
  try {
    services = await adminListServices();
  } catch (e) {
    return (
      <AdminShell active="services" title="Services">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="services"
      title="Services"
      subtitle="The four “Practice Areas” cards on the homepage."
    >
      <div className="admin-card">
        <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, marginBottom: 16 }}>
          Add a service
        </h3>
        <form action={saveService}>
          <ServiceFields />
          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">
              Add service
            </button>
          </div>
        </form>
      </div>

      {services.map((s) => (
        <div className="admin-card" key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <strong style={{ fontFamily: "var(--display)" }}>
              {s.number} · {s.title}
            </strong>
            <DeleteButton id={s.id} action={deleteService} label="Delete" />
          </div>
          <form action={saveService}>
            <input type="hidden" name="id" value={s.id} />
            <ServiceFields s={s} />
            <div className="admin-actions">
              <button className="btn btn-ghost-dk" type="submit">
                Save changes
              </button>
            </div>
          </form>
        </div>
      ))}
    </AdminShell>
  );
}
