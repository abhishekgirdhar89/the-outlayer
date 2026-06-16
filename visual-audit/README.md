# Visual audit — design mockups vs. live site

A Playwright harness that screenshots the **3 design HTML mockups** and the **live
Next.js site** at three breakpoints, then produces a side-by-side report with a
pixel-diff overlay and — most importantly — **exact pixel measurements** of where
the two differ.

## Run it

```bash
npm run dev                 # the live site must be running on :3000
node visual-audit/run.mjs   # screenshots both, diffs, writes the report
open visual-audit/report.html
```

Outputs:
- `screenshots/{design,live,diff}-<page>-<bp>.png`
- `results.json` — raw measurements + flags
- `report.html` — the side-by-side report

## What it measures

For every page × breakpoint it loads the design (the originals are self-unpacking
"bundler" HTML, rendered straight from `file://`) and the live route, freezes
animations (`reducedMotion`), then on **both** reads `getBoundingClientRect` +
computed styles for the same class names (the live CSS was ported from these
mockups, so selectors match). It flags any numeric property differing by ≥2px.

Breakpoints: **390 (mobile)**, **768 (tablet)**, **1280 (desktop)** — edit
`config.mjs` to add more (e.g. 560, 920, 1440) or change the measured selectors.

## Reading the report

- The **diff overlay** is *indicative only*: design tiles use hatched
  placeholders, the live site shows real photos, and copy lengths differ — so some
  red is expected.
- The **measurement table** is authoritative: red rows = a real ≥2px delta in
  width/height/padding/font-size/gap/columns.

### Known, expected residuals (not bugs)

- **`.d-prose` / `.d-main` height** on the article page: the design mockup contains
  a full long article; the seeded post is shorter. Pure content-length difference.
- **`.feat` / `.writing` heights**: card heights track copy length, which differs
  between the seeded data and the mockup text.
- **`.d-lead` "present vs missing"**: the live article shows a top cover image; the
  mockup placed its image *inside* the prose. A deliberate choice — remove the
  `.d-lead` block in `app/insights/[slug]/page.tsx` to match the mockup exactly.
- **`.chip` ±2px**, **`.lhead h1` line-wrap**: webfont metric variance (embedded
  woff2 in the mockup vs. the same Google fonts via `next/font`).
- **`.btn-primary` display `inline-flex`→`flex`**: a computed-value artifact (flex
  items are blockified); zero visual impact.
