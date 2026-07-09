-- =============================================================
-- THE OUTLAYER — database schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
--
-- Fully idempotent: safe to run repeatedly. Uses "add column if not
-- exists" so it also REPAIRS any pre-existing table (e.g. a `posts`
-- table from an earlier setup) by adding the columns this app needs.
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- PROJECTS (portfolio / "work") ----------
create table if not exists public.projects (id uuid primary key default gen_random_uuid());
alter table public.projects add column if not exists title       text not null default '';
alter table public.projects add column if not exists slug        text;
alter table public.projects add column if not exists category    text default '';
alter table public.projects add column if not exists summary     text default '';
alter table public.projects add column if not exists description text default '';
alter table public.projects add column if not exists image_url   text default '';
alter table public.projects add column if not exists featured    boolean not null default true;
alter table public.projects add column if not exists sort_order  int not null default 0;
alter table public.projects add column if not exists created_at  timestamptz not null default now();
create unique index if not exists projects_slug_key on public.projects (slug);

-- ---------- POSTS (insights / blog) ----------
create table if not exists public.posts (id uuid primary key default gen_random_uuid());
alter table public.posts add column if not exists title           text not null default '';
alter table public.posts add column if not exists slug            text;
alter table public.posts add column if not exists category        text default 'Strategy';
alter table public.posts add column if not exists excerpt         text default '';
alter table public.posts add column if not exists content         text default '';
alter table public.posts add column if not exists cover_image_url text default '';
alter table public.posts add column if not exists author          text default 'Abhishek Girdhar';
alter table public.posts add column if not exists read_minutes    int default 5;
alter table public.posts add column if not exists published       boolean not null default false;
alter table public.posts add column if not exists featured        boolean not null default false;
alter table public.posts add column if not exists published_at    timestamptz default now();
alter table public.posts add column if not exists created_at      timestamptz not null default now();
create unique index if not exists posts_slug_key on public.posts (slug);

-- ---------- SERVICES (practice areas) ----------
create table if not exists public.services (id uuid primary key default gen_random_uuid());
alter table public.services add column if not exists number      text default '';
alter table public.services add column if not exists title       text not null default '';
alter table public.services add column if not exists description text default '';
alter table public.services add column if not exists link        text default '';
alter table public.services add column if not exists sort_order  int not null default 0;

-- ---------- TESTIMONIALS ----------
create table if not exists public.testimonials (id uuid primary key default gen_random_uuid());
alter table public.testimonials add column if not exists quote      text not null default '';
alter table public.testimonials add column if not exists name       text default '';
alter table public.testimonials add column if not exists role       text default '';
alter table public.testimonials add column if not exists sort_order int not null default 0;

-- ---------- HOMEPAGE (single editable row, id = 1) ----------
create table if not exists public.homepage (id int primary key default 1);
alter table public.homepage add column if not exists hero_eyebrow      text default 'AI · Marketing · Operations';
alter table public.homepage add column if not exists hero_title        text default 'The non-obvious move';
alter table public.homepage add column if not exists hero_position     text default 'Strategy that gets *built.*';
alter table public.homepage add column if not exists hero_subtitle     text default 'The independent practice of Abhishek Girdhar — strategy, operations and technology, as one motion, for founders and operators.';
alter table public.homepage add column if not exists about_kicker      text default 'About Abhishek';
alter table public.homepage add column if not exists about_heading     text default 'An operator who *thinks and builds.*';
alter table public.homepage add column if not exists about_subheading  text default 'Fourteen years inside agencies — in *every seat* from sales to running the whole operation.';
alter table public.homepage add column if not exists about_body        text default 'The rare advisor who draws the plan and ships the system that makes it real — across marketing, operations, and technology. The background is the proof, not the pitch.';
alter table public.homepage add column if not exists about_photo_url   text default '';
alter table public.homepage add column if not exists stat1_value text default '14';  alter table public.homepage add column if not exists stat1_unit text default 'yrs'; alter table public.homepage add column if not exists stat1_label text default 'Operating across agencies — strategy to delivery.';
alter table public.homepage add column if not exists stat2_value text default '$5';  alter table public.homepage add column if not exists stat2_unit text default 'M+';  alter table public.homepage add column if not exists stat2_label text default 'Operations scaled, with the P&L owned.';
alter table public.homepage add column if not exists stat3_value text default '5';   alter table public.homepage add column if not exists stat3_unit text default '+';   alter table public.homepage add column if not exists stat3_label text default 'Delivery divisions launched across channels.';
alter table public.homepage add column if not exists stat4_value text default '30';  alter table public.homepage add column if not exists stat4_unit text default '+';   alter table public.homepage add column if not exists stat4_label text default 'People hired, trained, and led across teams.';
alter table public.homepage add column if not exists services_heading  text default 'Four ways I work — *each one, advice that ships.*';
alter table public.homepage add column if not exists services_lead     text default 'The short version below. The full scope for each lives on its own page.';
alter table public.homepage add column if not exists work_heading      text default 'Proof that strategy *gets built.*';
alter table public.homepage add column if not exists work_lead         text default 'A few concept builds — how the thinking turns into working systems, mapped to the service each belongs to.';
alter table public.homepage add column if not exists writing_heading   text default 'Notes on the *second-layer move.*';
alter table public.homepage add column if not exists writing_lead      text default 'Strategy, operations, and AI for people who build.';
alter table public.homepage add column if not exists subscribe_heading text default 'The second layer, *in your inbox.*';
alter table public.homepage add column if not exists subscribe_body    text default 'One read a week on the move beneath the obvious — strategy, operations, and AI for people who build. No noise.';
alter table public.homepage add column if not exists show_testimonials boolean not null default true;

insert into public.homepage (id) values (1) on conflict (id) do nothing;

-- =============================================================
-- ROW LEVEL SECURITY
-- Public (anon) can READ. All writes go through the service-role
-- key in the server-side admin panel, which bypasses RLS.
-- =============================================================
alter table public.projects     enable row level security;
alter table public.posts        enable row level security;
alter table public.services     enable row level security;
alter table public.testimonials enable row level security;
alter table public.homepage     enable row level security;

drop policy if exists "public read projects"     on public.projects;
drop policy if exists "public read posts"         on public.posts;
drop policy if exists "public read services"      on public.services;
drop policy if exists "public read testimonials"  on public.testimonials;
drop policy if exists "public read homepage"      on public.homepage;

create policy "public read projects"     on public.projects     for select using (true);
create policy "public read posts"        on public.posts        for select using (true);
create policy "public read services"     on public.services     for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read homepage"     on public.homepage     for select using (true);

-- =============================================================
-- SEED CONTENT (matches the original mockups). Optional but handy.
-- =============================================================
-- Remove duplicate service rows left behind by earlier (non-idempotent) runs.
delete from public.services a using public.services b
  where a.ctid > b.ctid and a.number = b.number and a.title = b.title;
-- Seed ONLY when the table is empty, so re-running this file never re-duplicates.
insert into public.services (number, title, description, link, sort_order)
select * from (values
  ('01','Brand & GTM','Positioning and a go-to-market the whole company can actually run. The sharpest version of what you do, who it''s for, and why it wins — built to execute, not just admire.','',1),
  ('02','Growth Marketing','The few channels and moves that actually move the number. Less motion, more progress — a focused read on where the next dollar compounds, and the discipline to ignore the rest.','',2),
  ('03','AI Automation','Practical AI systems that take real, repeatable work off the team. Content pipelines, reporting, and back-office workflows that run themselves — built by an operator who ships with AI daily.','',3),
  ('04','Marketing Ops','The operating system that lets marketing scale cleanly as you grow. Process, stack, and team designed so output never bottlenecks on one person or breaks under load.','',4)
) as v(number, title, description, link, sort_order)
where not exists (select 1 from public.services);

-- Remove duplicate testimonial rows left behind by earlier (non-idempotent) runs.
delete from public.testimonials a using public.testimonials b
  where a.ctid > b.ctid and a.quote = b.quote and a.name = b.name;
-- Seed ONLY when the table is empty, so re-running this file never re-duplicates.
insert into public.testimonials (quote, name, role, sort_order)
select * from (values
  ('He found the lever the rest of us walked past for a year — then built the thing that pulled it. We''d spent months optimising the wrong number; he reframed the whole problem in one session and had a working system in front of us before the month was out.','Placeholder Name','Founder · SaaS',1),
  ('Strategy that didn''t stay on a slide. We had the system running inside two weeks. What struck me was how he moves between the thinking and the doing — one moment mapping the positioning, the next wiring up the automation that delivers it.','Placeholder Name','COO · Agency',2),
  ('The rare operator who can hold the whole picture and still ship the detail himself. He came in to fix our reporting and left us with a clearer view of the entire funnel — and the discipline to act on it.','Placeholder Name','VP Growth · DTC',3)
) as v(quote, name, role, sort_order)
where not exists (select 1 from public.testimonials);

insert into public.projects (title, slug, category, summary, image_url, featured, sort_order) values
  ('Social-media automation engine','social-media-automation-engine','AI Automation','One content idea → captioned, scheduled, and posted across channels, with reporting that writes itself.','https://picsum.photos/seed/ol-proj-social/1000/1200',true,1),
  ('Internal workflow transformation','internal-workflow-transformation','Marketing Ops','A tangle of spreadsheets and hand-offs redrawn as one clear pipeline — owners, stages, and SLAs visible to everyone.','https://picsum.photos/seed/ol-proj-workflow/1000/1200',true,2),
  ('Positioning & GTM sprint','positioning-gtm-sprint','Brand & GTM','A muddled pitch rebuilt into one sharp position and a go-to-market the whole team can run — message, audience, and the first three moves.','https://picsum.photos/seed/ol-proj-gtm/1000/1200',true,3)
on conflict (slug) do nothing;

insert into public.posts (title, slug, category, excerpt, cover_image_url, content, read_minutes, published, featured, published_at) values
  ('Strategy that gets built','strategy-that-gets-built','Strategy','What changes when the person who draws the plan is also the one who ships it.','https://picsum.photos/seed/ol-post-strategy/1200/675',
   '<p class="intro">Most strategy is sound. That''s the part people miss. The thinking holds up, the slides are clear, the room nods — and then the week begins, and the plan stays exactly where it was. On the slide.</p><p>A good strategy is a small set of honest choices: where to play, how to win, what to leave alone. Those choices are worth a lot. But they only start paying once they touch something real — a page, a product, a first move a customer can feel.</p><h2>The deck is not the work</h2><p>Between the decision and the doing sits a quiet handoff. Someone thinks; someone else builds. The thinking gets written down, passed along, interpreted — and a little of it goes missing at every step.</p><div class="pq">A plan you can act on Monday beats a perfect one you frame on a wall.</div><h2>One hand on both</h2><p>The gap closes when the same person holds both ends — the thinking and the building. When the strategist is also the one who ships, the choices stay intact, because there''s no translation step to lose them in.</p><h2>Build it small, build it now</h2><p>The fastest way to know a strategy is true is to ship a small version of it. Not the whole plan — the first real move.</p><h2>What stays after</h2><p>The point of the work isn''t a launch. It''s a system that keeps moving once the engagement ends.</p>',
   7,true,true,'2026-06-01'),
  ('The constraint one level down','the-constraint-one-level-down','Strategy','Why the metric you''re optimising is rarely the one setting your ceiling — and how to find the real one.','https://picsum.photos/seed/ol-post-constraint/1200/675','<p class="intro">Every team has a number it watches. Often it''s the wrong one.</p><p>The real constraint usually sits one level down from where everyone is looking.</p>',6,true,false,'2026-05-20'),
  ('Use AI, don''t sell it','use-ai-dont-sell-it','AI in practice','An operator''s take on where AI compounds inside a business — and where it''s just a demo.','https://picsum.photos/seed/ol-post-ai/1200/675','<p class="intro">The interesting question isn''t whether AI works. It''s where it compounds.</p>',5,true,false,'2026-05-10'),
  ('The offer is the channel','the-offer-is-the-channel','Growth','Before you look at the channel, look at the offer underneath it.','https://picsum.photos/seed/ol-post-offer/1200/675','<p class="intro">Most acquisition questions are positioning questions wearing a media plan.</p>',6,true,false,'2026-04-28'),
  ('Make the work legible','make-the-work-legible','Operations','Owners, stages, SLAs — why a process you can read at a glance outperforms a faster one you can''t.','https://picsum.photos/seed/ol-post-legible/1200/675','<p class="intro">A process you can read at a glance beats a faster one nobody understands.</p>',5,true,false,'2026-04-15'),
  ('Positioning before paid','positioning-before-paid','Growth','The cheapest growth lever is usually the sentence on the page.','https://picsum.photos/seed/ol-post-positioning/1200/675','<p class="intro">Before a dollar goes to spend, the sentence on the page has to earn it.</p>',5,true,false,'2026-03-30')
on conflict (slug) do nothing;

-- =============================================================
-- v2 ADDITIONS — forms, leads, subscribers, clients, toggles
-- (idempotent; re-run this whole file in the SQL editor)
-- =============================================================

-- homepage: hero image, section toggles, enquiry copy
alter table public.homepage add column if not exists hero_image_url  text default '';
alter table public.homepage add column if not exists show_hero       boolean not null default true;
alter table public.homepage add column if not exists show_about      boolean not null default true;
alter table public.homepage add column if not exists show_services   boolean not null default true;
alter table public.homepage add column if not exists show_clients    boolean not null default true;
alter table public.homepage add column if not exists show_work       boolean not null default true;
alter table public.homepage add column if not exists show_writing    boolean not null default true;
alter table public.homepage add column if not exists show_enquiry    boolean not null default true;
alter table public.homepage add column if not exists show_subscribe  boolean not null default true;
alter table public.homepage add column if not exists enquiry_eyebrow text default 'Get in touch';
alter table public.homepage add column if not exists enquiry_heading text default 'Let''s find the *non-obvious move.*';
alter table public.homepage add column if not exists enquiry_body    text default 'Tell me where you''re headed in one line. We''ll take it from there over a short working session.';

-- services: image
alter table public.services add column if not exists image_url text default '';

-- clients (the scrolling "Built alongside" strip)
create table if not exists public.clients (id uuid primary key default gen_random_uuid());
alter table public.clients add column if not exists name       text not null default '';
alter table public.clients add column if not exists logo_url   text default '';
alter table public.clients add column if not exists sort_order int not null default 0;
create unique index if not exists clients_name_key on public.clients (name);

-- lead statuses (admin-managed pipeline stages)
create table if not exists public.lead_statuses (id uuid primary key default gen_random_uuid());
alter table public.lead_statuses add column if not exists label      text not null default '';
alter table public.lead_statuses add column if not exists sort_order int not null default 0;
create unique index if not exists lead_statuses_label_key on public.lead_statuses (label);

-- leads / enquiries (captured from the contact form)
create table if not exists public.leads (id uuid primary key default gen_random_uuid());
alter table public.leads add column if not exists name       text default '';
alter table public.leads add column if not exists email      text default '';
alter table public.leads add column if not exists phone      text default '';
alter table public.leads add column if not exists message    text default '';
alter table public.leads add column if not exists source     text default 'Homepage';
alter table public.leads add column if not exists status     text default 'New';
alter table public.leads add column if not exists created_at timestamptz not null default now();

-- subscribers (newsletter)
create table if not exists public.subscribers (id uuid primary key default gen_random_uuid());
alter table public.subscribers add column if not exists email      text not null default '';
alter table public.subscribers add column if not exists status     text default 'Active';
alter table public.subscribers add column if not exists source     text default 'Website';
alter table public.subscribers add column if not exists created_at timestamptz not null default now();
create unique index if not exists subscribers_email_key on public.subscribers (lower(email));

-- RLS: clients are public-read (homepage marquee). leads/subscribers/lead_statuses
-- stay private — all access goes through the service-role key in server actions.
alter table public.clients       enable row level security;
alter table public.lead_statuses enable row level security;
alter table public.leads         enable row level security;
alter table public.subscribers   enable row level security;
drop policy if exists "public read clients" on public.clients;
create policy "public read clients" on public.clients for select using (true);

-- seeds
insert into public.lead_statuses (label, sort_order) values
  ('New',1),('Interested',2),('Contacted',3),('Closed',4)
on conflict (label) do nothing;

insert into public.clients (name, sort_order) values
  ('Maruti Suzuki',1),('LPU',2),('Mu Sigma',3),('DishTV',4),('Fab India',5),('Lingo Sailor',6)
on conflict (name) do nothing;

-- =============================================================
-- v3 ADDITIONS — header/footer (site settings + nav items)
-- =============================================================
create table if not exists public.site_settings (id int primary key default 1);
alter table public.site_settings add column if not exists brand_name       text default 'The Outlayer';
alter table public.site_settings add column if not exists header_cta_label text default 'Book a working session';
alter table public.site_settings add column if not exists header_cta_href  text default '/#enquiry';
alter table public.site_settings add column if not exists footer_tagline   text default 'The non-obvious move. · Strategy that gets built.';
alter table public.site_settings add column if not exists footer_copyright text default '© 2026 · Abhishek Girdhar';
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.nav_items (id uuid primary key default gen_random_uuid());
alter table public.nav_items add column if not exists label      text not null default '';
alter table public.nav_items add column if not exists href       text default '';
alter table public.nav_items add column if not exists sort_order int not null default 0;

alter table public.site_settings enable row level security;
alter table public.nav_items     enable row level security;
drop policy if exists "public read site_settings" on public.site_settings;
drop policy if exists "public read nav_items" on public.nav_items;
create policy "public read site_settings" on public.site_settings for select using (true);
create policy "public read nav_items" on public.nav_items for select using (true);

-- Remove duplicate menu items left behind by earlier (non-idempotent) runs —
-- this is what caused "About Us showing twice / everything showing twice".
delete from public.nav_items a using public.nav_items b
  where a.ctid > b.ctid and a.label = b.label and a.href = b.href;
-- Seed ONLY when the table is empty, so re-running this file never re-duplicates.
insert into public.nav_items (label, href, sort_order)
select * from (values
  ('About','/#about',1),('Practice','/#services',2),('Work','/#work',3),('Insights','/insights',4)
) as v(label, href, sort_order)
where not exists (select 1 from public.nav_items);

-- =============================================================
-- v4 ADDITIONS — SEO / meta (per-page title, description, keywords)
-- =============================================================
-- page-level SEO (home, insights, …); posts carry their own below
create table if not exists public.page_seo (slug text primary key);
alter table public.page_seo add column if not exists meta_title       text default '';
alter table public.page_seo add column if not exists meta_description  text default '';
alter table public.page_seo add column if not exists meta_keywords     text default '';

alter table public.page_seo enable row level security;
drop policy if exists "public read page_seo" on public.page_seo;
create policy "public read page_seo" on public.page_seo for select using (true);

insert into public.page_seo (slug, meta_title, meta_description, meta_keywords) values
  ('home','The Outlayer — Strategy that gets built · Abhishek Girdhar','The independent practice of Abhishek Girdhar — strategy, operations and technology for founders and operators. The non-obvious move, built.','strategy, operations, marketing, AI automation, go-to-market, Abhishek Girdhar'),
  ('insights','Insights — The Outlayer','Strategy, operations, growth, and AI — short reads on the move beneath the obvious, for people who build.','strategy, operations, growth, AI, marketing, insights')
on conflict (slug) do nothing;

-- per-post SEO overrides (fall back to title/excerpt when empty)
alter table public.posts add column if not exists meta_title       text default '';
alter table public.posts add column if not exists meta_description  text default '';
alter table public.posts add column if not exists meta_keywords     text default '';

-- =============================================================
-- v5 ADDITIONS — editable hero CTAs, services CTA label, testimonial image
-- =============================================================
-- Hero call-to-action buttons (were previously hardcoded)
alter table public.homepage add column if not exists hero_cta1_label text default 'I need help';
alter table public.homepage add column if not exists hero_cta1_href  text default '#enquiry';
alter table public.homepage add column if not exists hero_cta2_label text default 'See the work';
alter table public.homepage add column if not exists hero_cta2_href  text default '#work';

-- Practice-area card CTA label (was hardcoded "Know more")
alter table public.services add column if not exists cta_label text default 'Know more';

-- Testimonial client photo
alter table public.testimonials add column if not exists image_url text default '';

-- Enquiry acknowledgement screen (shown after the contact form is submitted)
alter table public.homepage add column if not exists ack_eyebrow      text default 'Received';
alter table public.homepage add column if not exists ack_heading      text default 'Got it, {name} — thank you.';
alter table public.homepage add column if not exists ack_body         text default 'Your note is in, and your details are saved. The next step is a short working session — pick a time that suits you.';
alter table public.homepage add column if not exists ack_echo_label   text default 'What you sent';
alter table public.homepage add column if not exists ack_cta_label    text default 'Pick a time on Calendly';
alter table public.homepage add column if not exists ack_cta_href     text default '';
alter table public.homepage add column if not exists ack_contact_email text default 'hello@theoutlayer.com';

-- About → "Employers" credibility row (comma- or newline-separated company names)
alter table public.homepage add column if not exists about_employers text default 'Accenture, Google, AdGlobal360, NP Digital';

-- =============================================================
-- v6 ADDITIONS — social/search defaults + per-page OG image
-- =============================================================
-- Global SEO defaults (live on the site_settings singleton)
alter table public.site_settings add column if not exists site_url         text default 'https://theoutlayer.com';
alter table public.site_settings add column if not exists default_og_image text default '';
alter table public.site_settings add column if not exists twitter_handle   text default '';

-- Per-page social share image (home, insights). Posts use their cover image.
alter table public.page_seo add column if not exists og_image text default '';

-- Google Analytics (GA4) measurement ID, e.g. G-XXXXXXXXXX. Empty = analytics off.
alter table public.site_settings add column if not exists ga_measurement_id text default '';

-- Per-post social share image (overrides the featured image for OG/Twitter cards)
alter table public.posts add column if not exists og_image text default '';

-- =============================================================
-- v7 ADDITIONS — managed article categories (taxonomy for Insights posts)
-- =============================================================
create table if not exists public.post_categories (id uuid primary key default gen_random_uuid());
alter table public.post_categories add column if not exists name       text not null default '';
alter table public.post_categories add column if not exists sort_order int  not null default 0;
create unique index if not exists post_categories_name_key on public.post_categories (lower(name));

alter table public.post_categories enable row level security;
drop policy if exists "public read post_categories" on public.post_categories;
create policy "public read post_categories" on public.post_categories for select using (true);

-- Seed from categories already used by posts, then a few sensible defaults.
insert into public.post_categories (name, sort_order)
select distinct category, 0 from public.posts
  where coalesce(category, '') <> ''
    and not exists (select 1 from public.post_categories pc where lower(pc.name) = lower(posts.category));
insert into public.post_categories (name, sort_order)
select v.name, v.so from (values ('Strategy', 1), ('AI in practice', 2), ('Growth', 3), ('Operations', 4)) as v(name, so)
  where not exists (select 1 from public.post_categories pc where lower(pc.name) = lower(v.name));

-- =============================================================
-- v8 ADDITIONS — legal pages (CMS-editable) + cookie consent banner
-- =============================================================
create table if not exists public.legal_pages (slug text primary key);
alter table public.legal_pages add column if not exists title      text not null default '';
alter table public.legal_pages add column if not exists content    text not null default '';
alter table public.legal_pages add column if not exists published  boolean not null default true;
alter table public.legal_pages add column if not exists sort_order int not null default 0;
alter table public.legal_pages add column if not exists updated_at  timestamptz not null default now();

alter table public.legal_pages enable row level security;
drop policy if exists "public read legal_pages" on public.legal_pages;
create policy "public read legal_pages" on public.legal_pages for select using (true);

-- Cookie-consent banner settings (on the site_settings singleton)
alter table public.site_settings add column if not exists cookie_enabled boolean default true;
alter table public.site_settings add column if not exists cookie_title   text default 'We value your privacy';
alter table public.site_settings add column if not exists cookie_message text default 'We use cookies to analyse traffic and improve your experience. Accept to help us, or reject non-essential cookies — your choice is remembered.';

-- Seed the standard legal pages with editable starter content (dollar-quoted, so apostrophes are safe).
insert into public.legal_pages (slug, title, sort_order, content) values
('privacy-policy', 'Privacy Policy', 1, $html$<p class="intro">This Privacy Policy explains how The Outlayer ("we", "us") collects, uses, and protects your information when you visit theoutlayer.com.</p>
<h2>Who we are</h2>
<p>The Outlayer is the independent practice of Abhishek Girdhar. For any privacy questions, contact us at hello@theoutlayer.com.</p>
<h2>Information we collect</h2>
<ul><li>Details you submit through our enquiry or subscribe forms — such as your name, email, and message.</li><li>Basic analytics data — such as pages visited and approximate location — collected only with your consent.</li></ul>
<h2>How we use your information</h2>
<ul><li>To respond to your enquiries and provide our services.</li><li>To send updates you have subscribed to.</li><li>To understand and improve how the site is used.</li></ul>
<h2>Cookies and analytics</h2>
<p>We use cookies and analytics tools only after you accept them via our cookie banner. See our Cookie Policy for details. You can withdraw consent at any time by clearing your cookies.</p>
<h2>Sharing your information</h2>
<p>We do not sell your personal data. We may share it with service providers — such as hosting and analytics providers — strictly to operate this site.</p>
<h2>Your rights</h2>
<p>Depending on your location, you may have the right to access, correct, or delete your personal data, or object to its processing. To exercise these rights, email hello@theoutlayer.com.</p>
<h2>Contact</h2>
<p>Questions about this policy? Email hello@theoutlayer.com.</p>
<p><em>This is a starting template — review it with a qualified professional before relying on it.</em></p>$html$),
('terms', 'Terms & Conditions', 2, $html$<p class="intro">These Terms govern your use of theoutlayer.com and any services provided by The Outlayer.</p>
<h2>Use of this site</h2>
<p>By accessing this site you agree to use it lawfully and not to misuse or disrupt it.</p>
<h2>Intellectual property</h2>
<p>All content on this site — text, design, and graphics — belongs to The Outlayer unless stated otherwise, and may not be reproduced without permission.</p>
<h2>Services</h2>
<p>Any engagement for consulting or advisory services is governed by a separate agreement. Nothing on this site constitutes a binding offer.</p>
<h2>Limitation of liability</h2>
<p>This site and its content are provided "as is". To the fullest extent permitted by law, The Outlayer is not liable for any loss arising from your use of the site.</p>
<h2>Changes</h2>
<p>We may update these Terms from time to time. Continued use of the site means you accept the current version.</p>
<h2>Contact</h2>
<p>Questions? Email hello@theoutlayer.com.</p>
<p><em>This is a starting template — review it with a qualified professional before relying on it.</em></p>$html$),
('disclaimer', 'Disclaimer', 3, $html$<p class="intro">The information on theoutlayer.com is provided for general informational purposes only.</p>
<h2>Not professional advice</h2>
<p>Content on this site — including articles and insights — is not professional, legal, financial, or business advice. You should seek qualified advice before acting on anything you read here.</p>
<h2>No guarantees</h2>
<p>While we aim for accuracy, we make no warranties about the completeness or reliability of any information on this site. Any reliance you place on it is at your own risk.</p>
<h2>External links</h2>
<p>This site may link to third-party websites. We are not responsible for their content or practices.</p>
<h2>Contact</h2>
<p>Questions? Email hello@theoutlayer.com.</p>
<p><em>This is a starting template — review it with a qualified professional before relying on it.</em></p>$html$),
('cookie-policy', 'Cookie Policy', 4, $html$<p class="intro">This Cookie Policy explains how The Outlayer uses cookies on theoutlayer.com.</p>
<h2>What are cookies</h2>
<p>Cookies are small text files stored on your device that help websites function and understand how they are used.</p>
<h2>How we use cookies</h2>
<ul><li><strong>Essential cookies</strong> — required for the site to work, including remembering your cookie choice.</li><li><strong>Analytics cookies</strong> — help us understand how visitors use the site. These load only if you accept them.</li></ul>
<h2>Your choices</h2>
<p>When you first visit, you can accept or reject non-essential cookies via our banner. You can change your mind at any time by clearing your browser cookies for this site, which shows the banner again.</p>
<h2>Contact</h2>
<p>Questions? Email hello@theoutlayer.com.</p>
<p><em>This is a starting template — review it with a qualified professional before relying on it.</em></p>$html$)
on conflict (slug) do nothing;

-- =============================================================
-- v9 ADDITIONS — SERVICE PAGES (scroll-story offer pages, CMS-editable)
-- Four pages (Fractional CMO + AI Automation + Go-to-Market + Growth),
-- one shared architecture. All copy is editable here; the LayerStage SVG
-- pose geometry (the visual metaphor) lives in code, keyed by slug.
-- Repeatable content (story panels, how-it-works steps, content-hub
-- cards, proof stats) is stored as JSONB so editors can add/remove/reorder
-- rows without a schema change. SEO for each page uses the page_seo table
-- (rows seeded below); the client marquee reuses the clients table.
-- =============================================================
create table if not exists public.service_pages (slug text primary key);
-- identity / ordering
alter table public.service_pages add column if not exists title       text not null default '';
alter table public.service_pages add column if not exists published   boolean not null default true;
alter table public.service_pages add column if not exists sort_order  int not null default 0;
-- quiet fixed nav
alter table public.service_pages add column if not exists nav_back_label text default 'All practice areas';
alter table public.service_pages add column if not exists nav_back_href  text default '/#services';
-- MOVEMENT ONE — scroll-story panels (JSONB array; see shape note below)
alter table public.service_pages add column if not exists panels jsonb not null default '[]'::jsonb;
-- MOVEMENT TWO — Section A: contact form copy
alter table public.service_pages add column if not exists form_tag             text default 'Start here';
alter table public.service_pages add column if not exists form_head            text default '';
alter table public.service_pages add column if not exists form_context_label   text default 'What''s running, and what''s not adding up?';
alter table public.service_pages add column if not exists form_context_hint    text default '(a couple of lines is plenty)';
alter table public.service_pages add column if not exists form_context_placeholder text default '';
alter table public.service_pages add column if not exists form_note            text default '';
alter table public.service_pages add column if not exists form_ack_heading     text default 'Got it — it''s with me.';
alter table public.service_pages add column if not exists form_ack_body        text default '';
-- Section B: how it works
alter table public.service_pages add column if not exists how_tag  text default 'How this actually goes';
alter table public.service_pages add column if not exists how_head text default '';
alter table public.service_pages add column if not exists steps    jsonb not null default '[]'::jsonb;
-- Section C: content hub
alter table public.service_pages add column if not exists hub_tag  text default 'Read the long way';
alter table public.service_pages add column if not exists hub_head text default '';
alter table public.service_pages add column if not exists cards    jsonb not null default '[]'::jsonb;
-- Section D: proof strip
alter table public.service_pages add column if not exists proof_line text default '';
alter table public.service_pages add column if not exists stats      jsonb not null default '[]'::jsonb;
alter table public.service_pages add column if not exists cred_label text default 'Built alongside';
-- Optional page-specific "system flow" diagram (AI page). JSON object or null.
alter table public.service_pages add column if not exists flow jsonb;
-- umbrella cross-link (rich HTML with links to the sibling offer pages)
alter table public.service_pages add column if not exists umbrella_html text default '';
-- header "Practice" mega-menu fields (short label + one-line blurb + umbrella flag)
alter table public.service_pages add column if not exists menu_label  text default '';
alter table public.service_pages add column if not exists menu_blurb  text default '';
alter table public.service_pages add column if not exists is_umbrella boolean not null default false;

alter table public.service_pages enable row level security;
drop policy if exists "public read service_pages" on public.service_pages;
create policy "public read service_pages" on public.service_pages for select using (true);

-- Lead notification + acknowledgement settings (used by every enquiry form).
-- Provider secrets (API key, from-address) live in env, not the DB. These two
-- are the editor-facing knobs.
alter table public.site_settings add column if not exists lead_notify_email text default 'think.outlayer@gmail.com';
alter table public.site_settings add column if not exists booking_url        text default '';
-- Public "reach me" address shown to enquirers (on-screen + in the ack email).
alter table public.site_settings add column if not exists contact_email      text default 'hello@theoutlayer.com';
-- Acknowledgement email copy (editable). {name} = sender first name, {service} = the offer.
alter table public.site_settings add column if not exists ack_email_subject  text default 'Thanks, {name} — I''ve got your note';
alter table public.site_settings add column if not exists ack_email_heading  text default 'Got it, {name} — it''s with me.';
alter table public.site_settings add column if not exists ack_email_body     text default 'Thanks for reaching out about {service}. I read every note personally and I''ll come back to you with a straight first read, usually within a day.';
alter table public.site_settings add column if not exists ack_email_signoff  text default 'Abhishek Girdhar';
-- What {service} becomes on general (non-service) forms like the homepage,
-- so one acknowledgement template reads naturally everywhere.
alter table public.site_settings add column if not exists ack_service_fallback text default 'your enquiry';
-- LinkedIn profile URL — used as a sameAs signal in the structured data (schema.org).
alter table public.site_settings add column if not exists linkedin_url text default '';
-- Seed the LinkedIn profile once (only while blank, so admin edits persist).
update public.site_settings set linkedin_url = 'https://www.linkedin.com/in/abhishek-girdhar-consultant/'
  where id = 1 and coalesce(linkedin_url, '') = '';

-- panels[] element shape (all fields optional except pose):
--   { "pose": 1-5, "cap": "mono caption under the graphic",
--     "variant": "head" | "open" | "mid",   -- headline style
--     "tag": "mono kicker",
--     "head": "the headline (use *word* to accent a word in blue)",
--     "sub": "supporting paragraph",
--     "lines": [ { "text": "...", "strong": false } ],   -- stacked statements
--     "rows":  [ { "name": "...", "desc": "...", "hot": false } ] }  -- symptoms list
-- steps[]: { "phase": "Week 1", "lead": "Bold lead-in.", "desc": "the rest." }
-- cards[]: { "tag": "The idea", "heading": "...", "href": "/insights" }
-- stats[]: { "value": "6", "unit": "×", "label": "Operation scaled" }

-- Point the homepage practice-area cards at their new detail pages
-- (only when an editor hasn't already set a link).
update public.services set link = '/services/fractional-cmo'  where coalesce(link,'') = '' and title ilike '%fractional%';
update public.services set link = '/services/ai-automation'   where coalesce(link,'') = '' and title ilike '%ai%';
update public.services set link = '/services/go-to-market'    where coalesce(link,'') = '' and (title ilike '%gtm%' or title ilike '%go-to-market%' or title ilike '%brand%');
update public.services set link = '/services/growth-marketing' where coalesce(link,'') = '' and title ilike '%growth%';

-- Per-page SEO rows (editable in Admin → SEO / Meta alongside home & insights)
insert into public.page_seo (slug, meta_title, meta_description, meta_keywords) values
  ('services/fractional-cmo','Fractional CMO — Strategy that gets built · The Outlayer','You have more marketing than ever, and less clarity than ever. The problem was never a missing strategy — it''s the seat that holds all of it at once. One seat across your whole marketing picture.','fractional CMO, marketing leadership, strategy, GTM, growth, brand, AI systems, The Outlayer'),
  ('services/ai-automation','AI Systems & Automation · The Outlayer','Practical AI systems that take real, repeatable work off your team — content pipelines, reporting, and back-office workflows that run themselves.','AI automation, AI systems, workflow automation, content pipelines, The Outlayer'),
  ('services/go-to-market','Brand & Go-to-Market · The Outlayer','Positioning and a go-to-market the whole company can actually run — the sharpest version of what you do, who it''s for, and why it wins.','go-to-market, GTM, brand, positioning, launch strategy, The Outlayer'),
  ('services/growth-marketing','Growth Marketing · The Outlayer','The few channels and moves that actually move the number — less motion, more progress, and the discipline to ignore the rest.','growth marketing, performance marketing, acquisition, retention, The Outlayer')
on conflict (slug) do nothing;

-- Seed the Fractional CMO page (umbrella / reference implementation).
insert into public.service_pages (slug, title, sort_order, nav_back_label, nav_back_href,
  panels, form_head, form_context_label, form_context_hint, form_context_placeholder, form_note, form_ack_heading, form_ack_body,
  how_head, steps, hub_head, cards, proof_line, stats, cred_label, umbrella_html)
values (
  'fractional-cmo', 'Fractional CMO', 1, 'All practice areas', '/#services',
  $json$[
    {"pose":1,"cap":"the whole, at rest","variant":"head","tag":"The Outlayer — Fractional CMO","head":"You have more marketing than ever. And less *clarity* than ever."},
    {"pose":2,"cap":"many pieces, no coordination","variant":"open","head":"Look at what's already running.","lines":[{"text":"A GTM plan here. A growth agency there. A brand exercise from last year. A few AI tools someone signed up for."},{"text":"Three freelancers, each doing their piece well."},{"text":"And you, in the middle, trying to make them all agree.","strong":true}]},
    {"pose":3,"cap":"the seat notices the whole","variant":"head","tag":"The non-obvious move","head":"The problem was never a missing strategy. You have plenty of those. What's missing is the seat that holds all of it at once.","sub":"Specialists optimise their slice. Someone has to own the whole — the direction every slice is meant to serve."},
    {"pose":4,"cap":"pulling into line","variant":"mid","head":"When no one holds the whole, it shows up quietly.","rows":[{"name":"Direction","desc":"The GTM push and the growth spend pull against each other."},{"name":"Message","desc":"The brand says one thing, the ads say another, the site a third."},{"name":"The tools","desc":"Six of them, none talking, no one sure what's working."},{"name":"The founder's desk","desc":"Every call routes back to you, the one person never meant to run marketing.","hot":true}]},
    {"pose":5,"cap":"held, and pointed one way","variant":"head","tag":"Strategy that gets built","head":"One seat across all of it. Not more plans — one direction the plans finally serve.","sub":"Sometimes that means guiding your team. Sometimes directing it. The seat flexes to what you need — what doesn't change is that someone is finally holding the whole picture."}
  ]$json$::jsonb,
  'Tell me what your marketing looks like right now.',
  'What''s running, and what''s not adding up?',
  '(a couple of lines is plenty)',
  'A D2C brand in India. Two agencies, a freelancer, a few tools. Everyone''s busy, growth is flat, and I''m the one holding it all together.',
  'No big deck in return. Just a straight read on where the picture isn''t holding together, usually within a day.',
  'Got it — it''s with me.',
  'I''ll come back with a straight read on where the picture isn''t holding together, usually within a day. No big deck, just the first move.',
  'Not another vendor. The seat above them.',
  $json$[
    {"phase":"Week 1","lead":"See the whole board.","desc":"I map everything already running — plans, people, agencies, tools — and find where they're pulling apart."},
    {"phase":"Weeks 2–4","lead":"Set one direction.","desc":"The pieces get a single plan to serve. Priorities, ownership, and what to stop doing get decided."},
    {"phase":"Then","lead":"Hold it together.","desc":"I stay in the seat — guiding the team or directing the work — so the direction survives contact with a busy week."},
    {"phase":"Ongoing","lead":"Adjust as you grow.","desc":"The picture changes as you scale. The seat keeps it coherent instead of letting it fragment again."}
  ]$json$::jsonb,
  'The thinking underneath the seat.',
  $json$[
    {"tag":"The idea","heading":"You don't have a strategy problem. You have a nobody-owns-the-whole problem.","href":"/insights"},
    {"tag":"Self-check","heading":"Six signs your marketing pieces are quietly working against each other.","href":"/insights"},
    {"tag":"The moment","heading":"When a founder should stop running marketing themselves.","href":"/insights"}
  ]$json$::jsonb,
  'I''ve held this whole picture before — agency P&L, a team of two hundred, five countries.',
  $json$[
    {"value":"6","unit":"×","label":"Operation scaled"},
    {"value":"200","unit":"","label":"Person operation, from zero"},
    {"value":"$5","unit":"M","label":"P&L built from zero"},
    {"value":"5","unit":"","label":"Countries in 2 years"}
  ]$json$::jsonb,
  'Built alongside',
  $html$The pieces this seat holds together — {services}. Each runs on its own; the seat is what keeps them pointed the same way.$html$
)
on conflict (slug) do nothing;

-- Seed the AI Systems page.
insert into public.service_pages (slug, title, sort_order, nav_back_label, nav_back_href,
  panels, form_head, form_context_label, form_context_hint, form_context_placeholder, form_note, form_ack_heading, form_ack_body,
  how_head, steps, hub_tag, hub_head, cards, proof_line, stats, cred_label, flow, umbrella_html)
values (
  'ai-automation', $t$AI Systems$t$, 2, 'All practice areas', '/#services',
  $json$[
    {"pose":1,"cap":"the tools you already have","variant":"head","tag":"The Outlayer — AI systems","head":"Everyone has an AI *strategy*. Almost no one has an AI system."},
    {"pose":2,"cap":"connected to nothing","variant":"open","head":"Start with a fair question.","lines":[{"text":"This whole practice — the site, the design, the content that reaches you — was built by one person."},{"text":"I don't design. I don't write code."},{"text":"I had the ideas, and I built the systems that shipped them.","strong":true}]},
    {"pose":3,"cap":"links forming","variant":"head","tag":"The non-obvious move","head":"The problem was never which tool. AI got treated as something to adopt, when it's something to build into how the work already moves.","sub":"A tool sits in a tab and waits for you. A system runs the work and brings you the decisions."},
    {"pose":4,"cap":"a system, not a stack","variant":"mid","head":"Take the content that reached you here. This is how it runs.","rows":[{"name":"One agent reads the market","desc":"Tracks what's shifting in the space, so the work starts from what's actually happening, not a guess."},{"name":"Another finds the demand","desc":"Surfaces the terms and topics people are actively searching, so nothing gets written into a void."},{"name":"I decide what's worth saying","desc":"The calendar builds itself from those two. I approve the topic and the angle, the judgment stays mine.","hot":true},{"name":"It drafts, I finish","desc":"A detailed draft is generated, then I edit in the take and the voice. Only then does it publish."}]},
    {"pose":5,"cap":"running on its own","variant":"head","tag":"Strategy that gets built","head":"You're not buying AI. You're buying judgment that finally has a way to ship.","sub":"The ideas are still the work. AI is what lets one person carry them from thought to live, the way this whole practice got built. That's what I build for you."}
  ]$json$::jsonb,
  $t$Tell me what's eating your hours.$t$,
  $t$What work keeps eating your time?$t$,
  '(a couple of lines is plenty)',
  $t$A marketing team of six. Two days a week just moving content between tools and rebuilding the same report. Sure there's a better way, don't know where to start.$t$,
  $t$No tool list in return. Just a straight read on the one system I'd build first, usually within a day.$t$,
  $t$Got it, it's with me.$t$,
  $t$I'll come back with a straight read on the one system I'd build first, usually within a day. No tool list, just the first move.$t$,
  $t$Not a platform rollout. One system that runs, then the next.$t$,
  $json$[
    {"phase":"Week 1","lead":"Find the drain.","desc":"I look for the work eating the most hours for the least judgment, the part a system should be doing, not a person."},
    {"phase":"Weeks 2–4","lead":"Build one that runs.","desc":"We ship a single working system end to end, into your real tools, not a demo. It has to run on its own before we move on."},
    {"phase":"Then","lead":"Widen from proof.","desc":"Once one holds, we build the next off the same spine, so they connect, instead of becoming six more subscriptions."},
    {"phase":"Ongoing","lead":"Judgment stays with you.","desc":"The systems move the work. You and I stay on the decisions. That line never blurs."}
  ]$json$::jsonb,
  'AI, read the long way',
  $t$The thinking underneath the work.$t$,
  $json$[
    {"tag":"Clarity","heading":"You don't need an AI strategy. You need one working system.","href":"/insights"},
    {"tag":"Build","heading":"I built a whole practice without knowing design or code. Here's the order I did it in.","href":"/insights"},
    {"tag":"Judgment","heading":"AI didn't make the work good. It made it fast. Those are different.","href":"/insights"}
  ]$json$::jsonb,
  $t$Fourteen years of this — agency P&L, programmatic, and building the systems underneath the work.$t$,
  $json$[
    {"value":"6","unit":"×","label":"Operation scaled"},
    {"value":"$5","unit":"M","label":"P&L built from zero"},
    {"value":"$30","unit":"M","label":"Annual media managed"},
    {"value":"5","unit":"","label":"Countries in 2 years"}
  ]$json$::jsonb,
  'Built alongside',
  $json${"tag":"What a system looks like","head":"Here's the one that wrote its way to you.","sub":"The content that brought you here runs on this. The grey steps run on their own. The lit ones are where I stay.","capLeft":"Automated, always running","capRight":"The judgment stays mine","foot":"then it publishes to the blog and LinkedIn","nodes":[{"stat":"running","title":"Reads the market","desc":"what's shifting now","lit":false},{"stat":"running","title":"Finds the demand","desc":"what people search","lit":false},{"stat":"running","title":"Calendar builds","desc":"from both signals","lit":false},{"stat":"you","title":"I decide the take","desc":"topic and angle","lit":true},{"stat":"running","title":"It drafts","desc":"detailed first pass","lit":false},{"stat":"you","title":"I finish it","desc":"the voice, the edge","lit":true}]}$json$::jsonb,
  ''
)
on conflict (slug) do nothing;

-- Seed the Brand & Go-to-Market page.
insert into public.service_pages (slug, title, sort_order, nav_back_label, nav_back_href,
  panels, form_head, form_context_label, form_context_hint, form_context_placeholder, form_note, form_ack_heading, form_ack_body,
  how_head, steps, hub_tag, hub_head, cards, proof_line, stats, cred_label, umbrella_html)
values (
  'go-to-market', $t$Brand & Go-to-Market$t$, 3, 'All practice areas', '/#services',
  $json$[
    {"pose":1,"cap":"in line","variant":"head","tag":"The Outlayer — Go-to-market","head":"Most go-to-market plans are finished the day before they go live."},
    {"pose":2,"cap":"filed · v.21","variant":"open","head":"The *strategy* was good.","lines":[{"text":"The deck was sharp. Everyone in the room nodded."},{"text":"Then it went into a folder."},{"text":"*Version 21.* The launch still hasn't happened."}]},
    {"pose":3,"cap":"back on the table","variant":"head","tag":"The non-obvious move","head":"Most consultants hand over a plan and leave. The plan was never the hard part.","sub":"A go-to-market doesn't die in the thinking. It dies in the months after the deck, when no one's left to carry it."},
    {"pose":4,"cap":"one stage breaks","variant":"mid","head":"A go-to-market breaks quietly, one stage at a time.","rows":[{"name":"Positioning","desc":"Everyone can describe it. No one can repeat it."},{"name":"The audience","desc":"Written for the market you want, not the one that buys."},{"name":"The message","desc":"Clear in the deck, gone by the landing page."},{"name":"Launch & the weeks after","desc":"Where most plans quietly stall, and where I stay.","hot":true}]},
    {"pose":5,"cap":"the layer that stays","variant":"head","tag":"Strategy that gets built","head":"I don't leave when the deck is done.","sub":"Some clients want the thinking and take it from there. Some want me to build it with them. Either way, I stay on the go-to-market until it's real, not a document, a running thing."},
    {"pose":5,"cap":"who it's for","variant":"mid","head":"Who this is for.","cols":{"built":["The founder running their first campaign, who needs it to actually go live.","The brand tired of spending six weeks on one headline."],"notFor":["Anyone who wants another deck to file.","Anyone who measures the work by how it looks in the room."]}},
    {"pose":7,"cap":"launched","variant":"head","head":"Your plan shouldn't die the day before it goes live.","sub":"This one won't. I'll be there when it does."}
  ]$json$::jsonb,
  $t$Tell me what you're taking to market.$t$,
  $t$What's the product or brand?$t$,
  '(a couple of lines is plenty)',
  $t$A new fintech app in India, first campaign, figuring out where to start. Or a legacy brand planning a relaunch. Whatever you're taking to market, in your own words.$t$,
  $t$No pitch deck in return. Just a straight read on what I'd do first, usually within a day.$t$,
  $t$Got it — it's with me.$t$,
  $t$I'll come back with a straight read on what I'd do first, usually within a day. No pitch deck, just the first move.$t$,
  $t$Not a retainer you can't read. Here's the shape of it.$t$,
  $json$[
    {"phase":"Week 1","lead":"The read.","desc":"I find the stage where it's actually breaking, usually one step upstream of where it hurts."},
    {"phase":"Weeks 2–4","lead":"The plan, made real.","desc":"Positioning, audience, message, decided, then turned into the pages, campaigns and sequences that carry it."},
    {"phase":"Launch","lead":"Live, together.","desc":"Whether you run it or I build it with you, I'm in the room when it goes out."},
    {"phase":"After","lead":"The part everyone skips.","desc":"The weeks where a plan usually stalls are the weeks I stay, reading the numbers, fixing what the market tells us."}
  ]$json$::jsonb,
  'GTM, read the long way',
  $t$The thinking underneath the work.$t$,
  $json$[
    {"tag":"Framework","heading":"Your growth problem is one stage upstream of where you feel it.","href":"/insights"},
    {"tag":"Teardown","heading":"Your plan didn't fail. It just never happened.","href":"/insights"},
    {"tag":"Playbook","heading":"First campaign vs. legacy relaunch: different game, same trap.","href":"/insights"}
  ]$json$::jsonb,
  $t$Fourteen years of this — agency P&L, programmatic, brand and growth.$t$,
  $json$[
    {"value":"6","unit":"×","label":"Operation scaled"},
    {"value":"$5","unit":"M","label":"P&L built from zero"},
    {"value":"$30","unit":"M","label":"Annual media managed"},
    {"value":"5","unit":"","label":"Countries in 2 years"}
  ]$json$::jsonb,
  'Built alongside',
  ''
)
on conflict (slug) do nothing;

-- Seed the Growth Marketing page.
insert into public.service_pages (slug, title, sort_order, nav_back_label, nav_back_href,
  panels, form_head, form_context_label, form_context_hint, form_context_placeholder, form_note, form_ack_heading, form_ack_body,
  how_head, steps, hub_tag, hub_head, cards, proof_line, stats, cred_label, umbrella_html)
values (
  'growth-marketing', $t$Growth Marketing$t$, 4, 'All practice areas', '/#services',
  $json$[
    {"pose":1,"cap":"the funnel at rest","variant":"head","tag":"The Outlayer — Growth marketing","head":"Growth is the one thing everyone tries to buy their way out of."},
    {"pose":2,"cap":"more in, same out","variant":"open","head":"So the *spend* went up.","lines":[{"text":"More budget. More channels. More agencies in the mix."},{"text":"The traffic climbed."},{"text":"The graph that mattered didn't move.","strong":true}]},
    {"pose":3,"cap":"leaking sideways","variant":"head","tag":"The non-obvious move","head":"Growth is almost never a volume problem. You were feeding a stage that was never the constraint.","sub":"Pouring more into the top of a funnel that leaks lower down doesn't grow anything. It just makes the leak more expensive."},
    {"pose":4,"cap":"one stage breaks","variant":"mid","head":"Growth breaks at one stage. The rest just carry the loss.","rows":[{"name":"Demand","desc":"Chasing people who were never going to buy."},{"name":"Capture","desc":"The right people arrive and nothing catches them."},{"name":"Convert","desc":"Where the spend usually dies, one step below where you're looking.","hot":true},{"name":"Keep","desc":"You buy them once, then let them go, and call it a traffic problem."}]},
    {"pose":5,"cap":"the constraint","variant":"head","tag":"Strategy that gets built","head":"Find the real constraint before you spend a rupee widening the top.","sub":"I read the whole chain, find the one stage holding everything back, and fix that first. Then the spend you were already making starts to work, before you add a single new channel."},
    {"pose":6,"cap":"the stack holds","variant":"mid","head":"Who this is for.","cols":{"built":["The team spending more every quarter and watching the same number stay flat.","The founder who suspects the problem isn't reach, but can't name where it actually is."],"notFor":["Anyone who thinks growth is a dial — more money in, more return out, in the same ratio.","Anyone measuring growth by what they spend, not by what comes out the other end."]}},
    {"pose":7,"cap":"moving together","variant":"head","head":"Growth isn't more. It's finding the one thing in the way.","sub":"Fix that, and the numbers you already have start to move."}
  ]$json$::jsonb,
  $t$Tell me what you're trying to grow.$t$,
  $t$What are you trying to grow, and what's flat?$t$,
  '(a couple of lines is plenty)',
  $t$A D2C brand in India. Traffic keeps rising, sales don't. Spending more on ads every month and can't tell where it's leaking.$t$,
  $t$No audit deck in return. Just a straight read on the stage I'd look at first, usually within a day.$t$,
  $t$Got it, it's with me.$t$,
  $t$I'll come back with a straight read on the stage I'd look at first, usually within a day. No audit deck, just the first move.$t$,
  $t$Not a bigger budget. A sharper one.$t$,
  $json$[
    {"phase":"Week 1","lead":"The read.","desc":"I map the whole chain, demand to retention, and find the one stage quietly holding the rest back."},
    {"phase":"Weeks 2–4","lead":"Fix the constraint.","desc":"We work the stage that's actually leaking, before touching spend, so the traffic you already have starts converting."},
    {"phase":"Then","lead":"Scale what works.","desc":"Only once the chain holds do we widen the top, into channels chosen on evidence, not habit."},
    {"phase":"Ongoing","lead":"Read and adjust.","desc":"Growth is a moving target. I stay on the numbers and move the effort to wherever the next constraint shows up."}
  ]$json$::jsonb,
  'Growth, read the long way',
  $t$The thinking underneath the work.$t$,
  $json$[
    {"tag":"Diagnosis","heading":"Your growth problem is one stage upstream of where you feel it.","href":"/insights"},
    {"tag":"Spend","heading":"More traffic didn't fix it. It just made the leak cost more.","href":"/insights"},
    {"tag":"Measurement","heading":"Stop scoring your brand work on the growth scoreboard.","href":"/insights"}
  ]$json$::jsonb,
  '',
  $json$[
    {"value":"6","unit":"×","label":"Operation scaled"},
    {"value":"$5","unit":"M","label":"P&L built from zero"},
    {"value":"$30","unit":"M","label":"Annual media managed"},
    {"value":"5","unit":"","label":"Countries in 2 years"}
  ]$json$::jsonb,
  'Built alongside',
  ''
)
on conflict (slug) do nothing;

-- Header "Practice" mega-menu: short label + one-line blurb + canonical order.
-- Only fills blanks (so admin edits persist across re-runs).
update public.service_pages set menu_label='Fractional CMO',   menu_blurb='The whole marketing function, held to one plan.', is_umbrella=true, sort_order=1 where slug='fractional-cmo'   and coalesce(menu_label,'')='';
update public.service_pages set menu_label='Brand & GTM',       menu_blurb='Positioning and a go-to-market you can run.',      sort_order=2 where slug='go-to-market'      and coalesce(menu_label,'')='';
update public.service_pages set menu_label='Growth Marketing',  menu_blurb='The few moves that actually move the number.',     sort_order=3 where slug='growth-marketing'  and coalesce(menu_label,'')='';
update public.service_pages set menu_label='AI Systems',        menu_blurb='Practical AI that takes real work off the team.',  sort_order=4 where slug='ai-automation'     and coalesce(menu_label,'')='';

-- =============================================================
-- v10 ADDITIONS — Fractional CMO page revision (SEO-driven).
-- New optional, per-page sections (blank on other pages, so they stay as-is):
-- credibility preline, "in plain terms" bridge, testimonials, FAQ, closing CTA.
-- =============================================================
alter table public.service_pages add column if not exists credibility_preline text default '';
alter table public.service_pages add column if not exists plain_tag           text default '';
alter table public.service_pages add column if not exists plain_head          text default '';
alter table public.service_pages add column if not exists plain_body          text default '';
alter table public.service_pages add column if not exists show_testimonials   boolean not null default false;
alter table public.service_pages add column if not exists testimonials_tag    text default '';
alter table public.service_pages add column if not exists testimonials_head   text default '';
alter table public.service_pages add column if not exists faq_tag             text default '';
alter table public.service_pages add column if not exists faq_head            text default '';
alter table public.service_pages add column if not exists faqs                jsonb not null default '[]'::jsonb;
alter table public.service_pages add column if not exists cta_tag             text default '';
alter table public.service_pages add column if not exists cta_head            text default '';
alter table public.service_pages add column if not exists cta_sub             text default '';
alter table public.service_pages add column if not exists cta_button          text default '';

-- Fractional CMO content updates (idempotent guards so admin edits persist).
-- 1) Story panels: hero "third beat" + em-dashes removed.
update public.service_pages set panels = $json$[
  {"pose":1,"cap":"the whole, at rest","variant":"head","tag":"The Outlayer · Fractional CMO","head":"You have more marketing than ever. And less *clarity* than ever. That is the moment for a fractional CMO."},
  {"pose":2,"cap":"many pieces, no coordination","variant":"open","head":"Look at what's already running.","lines":[{"text":"A GTM plan here. A growth agency there. A brand exercise from last year. A few AI tools someone signed up for."},{"text":"Three freelancers, each doing their piece well."},{"text":"And you, in the middle, trying to make them all agree.","strong":true}]},
  {"pose":3,"cap":"the seat notices the whole","variant":"head","tag":"The non-obvious move","head":"The problem was never a missing strategy. You have plenty of those. What's missing is the seat that holds all of it at once.","sub":"Specialists optimise their slice. Someone has to own the whole, the direction every slice is meant to serve."},
  {"pose":4,"cap":"pulling into line","variant":"mid","head":"When no one holds the whole, it shows up quietly.","rows":[{"name":"Direction","desc":"The GTM push and the growth spend pull against each other."},{"name":"Message","desc":"The brand says one thing, the ads say another, the site a third."},{"name":"The tools","desc":"Six of them, none talking, no one sure what's working."},{"name":"The founder's desk","desc":"Every call routes back to you, the one person never meant to run marketing.","hot":true}]},
  {"pose":5,"cap":"held, and pointed one way","variant":"head","tag":"Strategy that gets built","head":"One seat across all of it. Not more plans, one direction the plans finally serve.","sub":"Sometimes that means guiding your team. Sometimes directing it. The seat flexes to what you need. What doesn't change is that someone is finally holding the whole picture."}
]$json$::jsonb
where slug = 'fractional-cmo' and panels::text not like '%That is the moment%';

-- 2) Proof line: em-dash removed.
update public.service_pages
  set proof_line = $t$I've held this whole picture before. Agency P&L, a team of two hundred, five countries.$t$
  where slug = 'fractional-cmo' and proof_line like '%—%';

-- 3) New sections (only fill while blank).
update public.service_pages set
  credibility_preline = $t$I've held the whole picture before. Agency P&L, a team of two hundred, five countries.$t$,
  plain_tag = 'In plain terms',
  plain_head = 'What a fractional CMO actually is',
  plain_body = $t$A fractional CMO is a senior marketing leader who runs your marketing part-time, on a retainer, instead of as a full-time hire. You get the direction, the priorities, and the ownership of a chief marketing officer, at the fraction of cost and commitment that fits a growing company. One operator sets the strategy across brand, growth, and AI, and makes sure it gets built.$t$,
  show_testimonials = true,
  testimonials_tag = 'In their words',
  testimonials_head = 'The people who handed over the whole picture.',
  faq_tag = 'Questions people ask',
  faq_head = 'Fractional CMO, answered',
  cta_tag = 'When you''re ready',
  cta_head = 'One seat. The whole picture. Held together.',
  cta_sub = $t$If your marketing has the pieces but not the person holding them, that's the seat I take.$t$,
  cta_button = 'Start the conversation'
where slug = 'fractional-cmo' and coalesce(plain_head,'') = '';

-- 4) FAQ Q&As (only when empty).
update public.service_pages set faqs = $json$[
  {"q":"What does a fractional CMO do?","a":"A fractional CMO sets your marketing strategy and priorities, then owns that the work gets built. In practice that means direction, channel and budget calls, and keeping every piece pointed the same way."},
  {"q":"When should you hire a fractional CMO?","a":"When marketing has outgrown ad-hoc help and a full-time CMO is still too early. If you have budget going out and no senior owner making sure it works, that is the moment."},
  {"q":"How is a fractional CMO different from an agency?","a":"An agency delivers the work. A fractional CMO owns the strategy and the outcome, and directs the work, including any agencies you already run."},
  {"q":"How is it different from a full-time CMO?","a":"The same strategic ownership, at a fraction of the cost and commitment, without the full-time salary or the long ramp."},
  {"q":"How much does a fractional CMO cost?","a":"It runs on a monthly retainer, scaled to the scope of the work and your stage."},
  {"q":"What does the seat cover?","a":"The whole marketing picture, drawn from brand and go-to-market, growth, and AI systems, held to one direction."}
]$json$::jsonb
where slug = 'fractional-cmo' and (faqs is null or faqs = '[]'::jsonb);

-- =============================================================
-- v11 ADDITIONS — other three service pages:
--   (a) normalize em/en dashes to plain hyphens,
--   (b) enable the shared testimonials section.
-- =============================================================
-- (a) Replace — (U+2014) and – (U+2013) with - across all copy-bearing columns.
update public.service_pages set
  panels                   = replace(replace(panels::text, '—', '-'), '–', '-')::jsonb,
  steps                    = replace(replace(steps::text, '—', '-'), '–', '-')::jsonb,
  cards                    = replace(replace(cards::text, '—', '-'), '–', '-')::jsonb,
  proof_line               = replace(replace(proof_line, '—', '-'), '–', '-'),
  form_head                = replace(replace(form_head, '—', '-'), '–', '-'),
  form_context_label       = replace(replace(form_context_label, '—', '-'), '–', '-'),
  form_context_placeholder = replace(replace(form_context_placeholder, '—', '-'), '–', '-'),
  form_note                = replace(replace(form_note, '—', '-'), '–', '-'),
  form_ack_heading         = replace(replace(form_ack_heading, '—', '-'), '–', '-'),
  form_ack_body            = replace(replace(form_ack_body, '—', '-'), '–', '-'),
  how_head                 = replace(replace(how_head, '—', '-'), '–', '-'),
  hub_head                 = replace(replace(hub_head, '—', '-'), '–', '-'),
  umbrella_html            = replace(replace(umbrella_html, '—', '-'), '–', '-')
where slug in ('ai-automation', 'go-to-market', 'growth-marketing');

update public.service_pages set flow = replace(replace(flow::text, '—', '-'), '–', '-')::jsonb
  where slug = 'ai-automation' and flow is not null;

-- (b) Turn on the shared testimonials section (quotes come from the testimonials table).
update public.service_pages set
  show_testimonials = true,
  testimonials_tag  = 'In their words',
  testimonials_head = $t$What it's like to work together.$t$
where slug in ('ai-automation', 'go-to-market', 'growth-marketing');
