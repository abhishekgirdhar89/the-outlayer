import Link from "next/link";
import { saveProject } from "@/app/admin/actions";
import { ImageField } from "./ImageField";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProject} className="admin-card">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="fld">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" defaultValue={project?.title ?? ""} required />
      </div>

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={project?.slug ?? ""} placeholder="auto from title" />
          <span className="hint">Leave blank to generate from the title.</span>
        </div>
        <div className="fld">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            defaultValue={project?.category ?? ""}
            placeholder="e.g. AI Automation"
          />
        </div>
      </div>

      <div className="fld">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          name="summary"
          defaultValue={project?.summary ?? ""}
          placeholder="Short line shown on the card (on hover)."
          rows={2}
        />
      </div>

      <div className="fld">
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" defaultValue={project?.description ?? ""} rows={3} />
      </div>

      <ImageField
        name="image_url"
        label="Image"
        currentUrl={project?.image_url ?? ""}
        spec="Work tile — 1000×1200px (3:4), max 1MB, PNG/JPG. Leave empty for the hatched placeholder."
      />

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="sort_order">Sort order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} />
        </div>
        <div className="fld fld-check" style={{ alignSelf: "end", paddingBottom: 16 }}>
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={project ? project.featured : true}
          />
          <label htmlFor="featured">Featured on homepage</label>
        </div>
      </div>

      <div className="admin-actions">
        <button className="btn btn-primary" type="submit">
          {project ? "Save changes" : "Create project"}
        </button>
        <Link className="btn btn-ghost-dk" href="/admin/projects">
          Cancel
        </Link>
      </div>
    </form>
  );
}
