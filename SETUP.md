# The Outlayer — setup

A portfolio + insights CMS built with **Next.js 16** (App Router) and **Supabase**.
The public site matches the three brand mockups; everything is editable from a
password-protected admin panel at `/admin`.

## 1. Environment variables (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co   # bare project URL, NO /rest/v1/
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>                  # server-only; admin writes
ADMIN_PASSWORD=<choose a private password>                    # gate for /admin
```

- **`SUPABASE_SERVICE_ROLE_KEY`** is required for the admin panel. Get it from
  Supabase → **Project Settings → API → `service_role` secret**. It is only ever
  used on the server and never sent to the browser. Keep it secret.
- **`ADMIN_PASSWORD`** protects `/admin`. A default (`outlayer-admin`) is set for
  local dev — **change it before deploying.**

> Note: the original `.env.local` had a malformed URL (`ttps://…/rest/v1/`). It's
> been corrected to the bare project URL, which is what `supabase-js` expects.

## 2. Create the database tables

Open Supabase → **SQL Editor → New query**, paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql), and run it.

It creates five tables — `projects`, `posts`, `services`, `testimonials`,
`homepage` — with public read-only RLS policies, and seeds them with the mockup
content. It is **idempotent**: safe to run more than once, and it will also add
any missing columns to a table that already existed (your project already had a
`posts` table from an earlier setup — this script repairs it).

> **Re-run `schema.sql` after updates.** It now also creates the forms/CMS tables
> (`leads`, `lead_statuses`, `subscribers`, `clients`, `site_settings`, `nav_items`),
> the homepage section-toggle + hero/enquiry columns, and `services.image_url`.
> It's idempotent — paste the whole file and run it again.

### Image uploads (Supabase Storage)

Admin image fields upload to a public Storage bucket named **`media`** (created
automatically). If it's ever missing, create a public bucket called `media` in
Supabase → Storage. Every image field also accepts the branded placeholder when
left empty.

## 3. Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

- `/` — homepage (hero, about, services, featured **projects**, testimonials, recent **posts**)
- `/insights` — all published posts, with client-side category filtering
- `/insights/<slug>` — individual post (auto table-of-contents from `<h2>` tags)
- `/admin` — admin panel (redirects to `/admin/login` until you sign in)

## 4. Using the admin panel

Sign in at `/admin/login` with `ADMIN_PASSWORD`. Then:

| Section | What it controls |
|---|---|
| **Homepage** | All homepage copy + **section show/hide toggles**, hero graphic + profile image uploads, “Get in touch” copy, and live char/word count guides. Wrap text in `*asterisks*` for the blue accent |
| **Header & Footer** | Brand name, the nav menu (add/edit/delete/reorder items), header CTA button, footer tagline + copyright — applied site-wide |
| **Projects** | Portfolio work cards (image upload). `Featured` controls homepage visibility |
| **Insights / Posts** | Blog posts with featured-image upload. `Published` makes them live; `Featured` sets the lead article |
| **Services** | The four “Practice Areas” cards (image upload) |
| **Clients** | The scrolling “Built alongside” strip (name + optional logo) |
| **Testimonials** | The “Kind words” quotes |
| **Enquiries** | Contact-form submissions: filter by status, sort, change status inline, manage custom statuses (New/Interested/Contacted/Closed + your own), delete |
| **Subscribers** | Newsletter signups with timestamps; toggle Active/Unsubscribed |

### Forms

The contact form captures **name, email, phone, and message** into `leads`, with
email + phone validation, a honeypot, and a simple math CAPTCHA (no external keys).
The subscribe band validates the email and de-dupes into `subscribers`. Spam-bot
upgrades (e.g. Cloudflare Turnstile) can be swapped in later.

Changes are written with the service-role key and the public pages are revalidated
immediately, so edits appear on the next page load.

### Post content

The post **Content** field accepts HTML. Useful classes (styled to match the mockup):

- `<p class="intro">…</p>` — lead paragraph with a drop-cap
- `<h2>…</h2>` — section heading (auto-added to the contents rail)
- `<div class="pq">…</div>` — pull quote
- `<ul><li>…</li></ul>` — styled bullet list
- `<strong>`, `<a href>` — emphasized text / links

### Images

Image fields take a URL (e.g. a Supabase Storage public URL, or any image host).
Leave blank to show the branded hatched placeholder from the mockups.

## Notes

- **Design fidelity:** the marketing pages reproduce the locked v1.0 brand CSS in
  `app/globals.css` (Tailwind v4 is configured and powers the stylesheet + admin).
  This guarantees a pixel match to the mockups rather than re-deriving every
  gradient/animation as utility classes.
- **Auth** is a simple password gate (cookie + `proxy.ts`, Next 16's replacement
  for `middleware.ts`). For multiple editors, swap in Supabase Auth later.
- Pages use `dynamic = "force-dynamic"` so CMS edits are always reflected.
