import Link from "next/link";
import { savePost } from "@/app/admin/actions";
import { ImageField } from "./ImageField";
import { RichTextEditor } from "./RichTextEditor";
import { SeoFields } from "./SeoFields";
import type { Post, PostCategory } from "@/lib/types";

function dateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function PostForm({ post, categories = [] }: { post?: Post; categories?: PostCategory[] }) {
  const current = post?.category ?? categories[0]?.name ?? "Strategy";
  // Include the post's current category even if it's no longer in the managed list.
  const options = categories.some((c) => c.name === current)
    ? categories.map((c) => c.name)
    : [current, ...categories.map((c) => c.name)];
  return (
    <form action={savePost} className="admin-card">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="fld">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" defaultValue={post?.title ?? ""} required />
      </div>

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={post?.slug ?? ""} placeholder="auto from title" />
          <span className="hint">URL: /insights/&lt;slug&gt;</span>
        </div>
        <div className="fld">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={current}>
            {options.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="hint">
            Drives the insights filter chips.{" "}
            <Link className="linklike" href="/admin/posts/categories" target="_blank">
              Manage categories ↗
            </Link>
          </span>
        </div>
      </div>

      <div className="fld">
        <label htmlFor="excerpt">Excerpt / dek</label>
        <textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} />
      </div>

      <div className="fld">
        <label htmlFor="content">Content</label>
        <RichTextEditor name="content" defaultValue={post?.content ?? ""} />
        <span className="hint">
          Write naturally — use the toolbar for headings, <strong>bold</strong>, lists, links and
          pull quotes. <strong>Intro</strong> styles the opening paragraph with the drop cap.
          Headings (H2) are added to the article&apos;s contents rail automatically.
        </span>
      </div>

      <ImageField
        name="cover_image_url"
        label="Featured image"
        currentUrl={post?.cover_image_url ?? ""}
        spec="Featured image — 1200×675px (16:9), max 1MB, PNG/JPG. Shows on cards and inside the article."
      />

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="author">Author</label>
          <input id="author" name="author" defaultValue={post?.author ?? "Abhishek Girdhar"} />
        </div>
        <div className="fld">
          <label htmlFor="read_minutes">Read time (minutes)</label>
          <input id="read_minutes" name="read_minutes" type="number" defaultValue={post?.read_minutes ?? 5} />
        </div>
      </div>

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="published_at">Publish date</label>
          <input
            id="published_at"
            name="published_at"
            type="date"
            defaultValue={dateInputValue(post?.published_at ?? null)}
          />
          <span className="hint">Leave blank to use today.</span>
        </div>
        <div className="fld" style={{ justifyContent: "end", gap: 14 }}>
          <div className="fld-check">
            <input id="published" name="published" type="checkbox" defaultChecked={post?.published ?? false} />
            <label htmlFor="published">Published (visible on the site)</label>
          </div>
          <div className="fld-check">
            <input id="featured" name="featured" type="checkbox" defaultChecked={post?.featured ?? false} />
            <label htmlFor="featured">Featured (lead article on Insights)</label>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--bd)", margin: "8px 0 20px", paddingTop: 20 }}>
        <h3 className="sec-title" style={{ border: 0, paddingBottom: 0, marginBottom: 16 }}>
          SEO / meta
        </h3>
        <SeoFields
          source="post"
          defaults={{
            meta_title: post?.meta_title ?? "",
            meta_description: post?.meta_description ?? "",
            meta_keywords: post?.meta_keywords ?? "",
          }}
        />
        <ImageField
          name="og_image"
          label="Social share image"
          currentUrl={post?.og_image ?? ""}
          spec="Social image — 1200×630px, max 1MB, PNG/JPG. Shown when the article is shared on LinkedIn / X / WhatsApp. Leave blank to use the featured image."
        />
      </div>

      <div className="admin-actions">
        <button className="btn btn-primary" type="submit">
          {post ? "Save changes" : "Create post"}
        </button>
        <Link className="btn btn-ghost-dk" href="/admin/posts">
          Cancel
        </Link>
        {post?.published && (
          <Link className="linklike" href={`/insights/${post.slug}`} target="_blank">
            View live ↗
          </Link>
        )}
      </div>
    </form>
  );
}
