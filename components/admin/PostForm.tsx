import Link from "next/link";
import { savePost } from "@/app/admin/actions";
import { ImageField } from "./ImageField";
import type { Post } from "@/lib/types";

function dateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function PostForm({ post }: { post?: Post }) {
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
          <input
            id="category"
            name="category"
            defaultValue={post?.category ?? "Strategy"}
            placeholder="Strategy / AI in practice / Growth / Operations"
          />
          <span className="hint">Drives the insights filter chips.</span>
        </div>
      </div>

      <div className="fld">
        <label htmlFor="excerpt">Excerpt / dek</label>
        <textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} />
      </div>

      <div className="fld">
        <label htmlFor="content">Content (HTML)</label>
        <textarea
          id="content"
          name="content"
          defaultValue={post?.content ?? ""}
          rows={16}
          placeholder={'<p class="intro">Opening paragraph…</p>\n<h2>A section heading</h2>\n<p>Body…</p>\n<div class="pq">A pull quote.</div>\n<ul><li>List item</li></ul>'}
          style={{ fontFamily: "var(--mono)", fontSize: 13 }}
        />
        <span className="hint">
          HTML supported. Use &lt;p class=&quot;intro&quot;&gt; for the lead, &lt;h2&gt; for sections
          (auto-added to the contents rail), &lt;div class=&quot;pq&quot;&gt; for a pull quote.
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
