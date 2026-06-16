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
insert into public.services (number, title, description, link, sort_order) values
  ('01','Brand & GTM','Positioning and a go-to-market the whole company can actually run. The sharpest version of what you do, who it''s for, and why it wins — built to execute, not just admire.','',1),
  ('02','Growth Marketing','The few channels and moves that actually move the number. Less motion, more progress — a focused read on where the next dollar compounds, and the discipline to ignore the rest.','',2),
  ('03','AI Automation','Practical AI systems that take real, repeatable work off the team. Content pipelines, reporting, and back-office workflows that run themselves — built by an operator who ships with AI daily.','',3),
  ('04','Marketing Ops','The operating system that lets marketing scale cleanly as you grow. Process, stack, and team designed so output never bottlenecks on one person or breaks under load.','',4)
on conflict do nothing;

insert into public.testimonials (quote, name, role, sort_order) values
  ('He found the lever the rest of us walked past for a year — then built the thing that pulled it. We''d spent months optimising the wrong number; he reframed the whole problem in one session and had a working system in front of us before the month was out.','Placeholder Name','Founder · SaaS',1),
  ('Strategy that didn''t stay on a slide. We had the system running inside two weeks. What struck me was how he moves between the thinking and the doing — one moment mapping the positioning, the next wiring up the automation that delivers it.','Placeholder Name','COO · Agency',2),
  ('The rare operator who can hold the whole picture and still ship the detail himself. He came in to fix our reporting and left us with a clearer view of the entire funnel — and the discipline to act on it.','Placeholder Name','VP Growth · DTC',3)
on conflict do nothing;

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

insert into public.nav_items (label, href, sort_order) values
  ('About','/#about',1),('Practice','/#services',2),('Work','/#work',3),('Insights','/insights',4)
on conflict do nothing;
