import { AdminShell } from "@/components/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageField } from "@/components/admin/ImageField";
import { SaveFlash } from "@/components/admin/SaveFlash";
import { adminListTestimonials } from "@/lib/admin-data";
import { saveTestimonial, deleteTestimonial } from "../actions";
import type { Testimonial } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimonials — The Outlayer Admin" };

function TestimonialFields({ t }: { t?: Testimonial }) {
  return (
    <>
      <div className="fld">
        <label>Quote</label>
        <textarea name="quote" defaultValue={t?.quote ?? ""} rows={3} required />
      </div>
      <div className="fld-row">
        <div className="fld">
          <label>Name</label>
          <input name="name" defaultValue={t?.name ?? ""} placeholder="Jane Doe" />
        </div>
        <div className="fld">
          <label>Role</label>
          <input name="role" defaultValue={t?.role ?? ""} placeholder="Founder · SaaS" />
        </div>
      </div>
      <ImageField
        name="image_url"
        label="Client photo (optional)"
        currentUrl={t?.image_url ?? ""}
        spec="Client photo — square, 200×200px, max 1MB, PNG/JPG. Shown as a round avatar."
      />
      <div className="fld">
        <label>Sort order</label>
        <input name="sort_order" type="number" defaultValue={t?.sort_order ?? 0} />
      </div>
    </>
  );
}

export default async function TestimonialsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  let items;
  try {
    items = await adminListTestimonials();
  } catch (e) {
    return (
      <AdminShell active="testimonials" title="Testimonials">
        <div className="flash err">{e instanceof Error ? e.message : "Failed to load."}</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active="testimonials"
      title="Testimonials"
      subtitle="Quotes shown in the homepage “Kind words” section."
    >
      <SaveFlash saved={saved} deleted={deleted} />
      <div className="admin-card">
        <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, marginBottom: 16 }}>
          Add a testimonial
        </h3>
        <form action={saveTestimonial}>
          <TestimonialFields />
          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">
              Add testimonial
            </button>
          </div>
        </form>
      </div>

      {items.map((t) => (
        <div className="admin-card" key={t.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <strong style={{ fontFamily: "var(--display)" }}>{t.name || "Unnamed"}</strong>
            <DeleteButton id={t.id} action={deleteTestimonial} label="Delete" />
          </div>
          <form action={saveTestimonial}>
            <input type="hidden" name="id" value={t.id} />
            <TestimonialFields t={t} />
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
