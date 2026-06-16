# Deploying The Outlayer (Vercel)

Next.js 16 with Server Actions + `proxy.ts` middleware → **Vercel** is the natural host.

## 1. Push to GitHub

Create an **empty** repo at https://github.com/new (no README / .gitignore / license), then:

```bash
git remote add origin git@github.com:<you>/the-outlayer.git   # or the https:// URL
git push -u origin main
```

(The first commit already exists locally; `.env.local` is gitignored, so no secrets are pushed.)

## 2. Import into Vercel

1. https://vercel.com/new → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Leave build/output defaults.
3. Add these **Environment Variables** (Production + Preview), copying values from your
   local `.env.local`:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://bagscgunzzitdhtrjaog.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key from `.env.local`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (service_role key from `.env.local`) — server-only |
   | `ADMIN_PASSWORD` | a strong password for `/admin` |

4. Deploy.

## 3. After first deploy

- Visit `/admin` on the live URL → log in with `ADMIN_PASSWORD`.
- Supabase needs no domain allow-listing (REST is keyed). The `media` Storage bucket is
  already public.
- Image uploads are capped at **4 MB** client-side to stay under Vercel's 4.5 MB function
  body limit.

## Notes / known constraints
- Pages use `dynamic = "force-dynamic"` → rendered per request (fine on Vercel).
- If you later want bigger uploads, switch the admin image fields to **direct-to-Supabase
  Storage** (signed upload URL) to bypass the serverless body limit.
- Re-run `supabase/schema.sql` against the same Supabase project if you ever reset it.
