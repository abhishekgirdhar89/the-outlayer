import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { PAGES, BREAKPOINTS, NUM_TOL } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(__dirname, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

// --- measure computed layout for a list of selectors, in page context ---
async function measure(page, selectors) {
  return page.evaluate((sels) => {
    const px = (v) => v; // keep raw computed string
    const out = {};
    for (const { sel } of sels) {
      const el = document.querySelector(sel);
      if (!el) {
        out[sel] = null;
        continue;
      }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out[sel] = {
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.left),
        padding: `${px(cs.paddingTop)} ${px(cs.paddingRight)} ${px(cs.paddingBottom)} ${px(cs.paddingLeft)}`,
        pt: parseFloat(cs.paddingTop),
        pb: parseFloat(cs.paddingBottom),
        pl: parseFloat(cs.paddingLeft),
        fontSize: parseFloat(cs.fontSize),
        lineHeight: cs.lineHeight,
        gap: cs.gap && cs.gap !== "normal" ? cs.gap : cs.columnGap !== "normal" ? cs.columnGap : "",
        cols: cs.gridTemplateColumns && cs.gridTemplateColumns !== "none"
          ? cs.gridTemplateColumns.split(" ").length
          : null,
        display: cs.display,
      };
    }
    return out;
  }, selectors);
}

async function settle(page, ready) {
  // wait for the design "bundler" to unpack, or live to render
  try {
    await page.waitForSelector(ready, { timeout: 20000 });
  } catch {
    /* fall through; report will show empty measures */
  }
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null)).catch(() => {});
  // give images/layout a beat to finish
  await page.waitForTimeout(900);
  // scroll through to trigger any lazy/IO-driven reveals, then back to top
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += Math.max(400, window.innerHeight)) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

async function shoot(context, url, ready, selectors, file) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  await settle(page, ready);
  const measures = await measure(page, selectors).catch(() => ({}));
  await page.screenshot({ path: file, fullPage: true }).catch(() => {});
  await page.close();
  return { measures, errors };
}

// --- crop a PNG buffer to w×h (top-left) ---
function crop(png, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((png.width * Math.min(y, png.height - 1)) + Math.min(x, png.width - 1)) << 2;
      const di = (w * y + x) << 2;
      out.data[di] = png.data[si];
      out.data[di + 1] = png.data[si + 1];
      out.data[di + 2] = png.data[si + 2];
      out.data[di + 3] = png.data[si + 3];
    }
  }
  return out;
}

function diffImages(aPath, bPath, outPath) {
  const a = PNG.sync.read(fs.readFileSync(aPath));
  const b = PNG.sync.read(fs.readFileSync(bPath));
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const ca = crop(a, w, h);
  const cb = crop(b, w, h);
  const diff = new PNG({ width: w, height: h });
  const mismatched = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: 0.12 });
  fs.writeFileSync(outPath, PNG.sync.write(diff));
  return {
    w,
    h,
    mismatched,
    pct: +((mismatched / (w * h)) * 100).toFixed(2),
    heightDelta: a.height - b.height, // design - live
  };
}

const results = [];

const browser = await chromium.launch();
for (const bp of BREAKPOINTS) {
  const context = await browser.newContext({
    viewport: { width: bp.w, height: bp.h },
    deviceScaleFactor: 1,
    reducedMotion: "reduce", // freeze animations so screenshots are stable on both sides
  });
  for (const pg of PAGES) {
    const tag = `${pg.key}-${bp.key}`;
    const designPng = path.join(SHOTS, `design-${tag}.png`);
    const livePng = path.join(SHOTS, `live-${tag}.png`);
    const diffPng = path.join(SHOTS, `diff-${tag}.png`);
    process.stdout.write(`shooting ${tag} ... `);

    const design = await shoot(context, pathToFileURL(pg.design).href, pg.ready, pg.selectors, designPng);
    const live = await shoot(context, pg.live, pg.ready, pg.selectors, livePng);

    let diff = null;
    try {
      diff = diffImages(designPng, livePng, diffPng);
    } catch (e) {
      diff = { error: String(e) };
    }

    // build per-selector comparison
    const rows = [];
    for (const s of pg.selectors) {
      const d = design.measures?.[s.sel] || null;
      const l = live.measures?.[s.sel] || null;
      rows.push({ ...s, d, l, flags: flagDiffs(d, l) });
    }
    results.push({ page: pg.name, key: pg.key, bp, design, live, diff, rows, files: { designPng, livePng, diffPng } });
    console.log(diff?.pct != null ? `diff ${diff.pct}%` : "done");
  }
  await context.close();
}
await browser.close();

function flagDiffs(d, l) {
  const flags = [];
  if (!d || !l) {
    if (d && !l) flags.push({ prop: "presence", design: "present", live: "MISSING", bad: true });
    if (!d && l) flags.push({ prop: "presence", design: "MISSING", live: "present", bad: true });
    return flags;
  }
  const numProps = [
    ["w", "width"],
    ["h", "height"],
    ["x", "left x"],
    ["pt", "padding-top"],
    ["pb", "padding-bottom"],
    ["pl", "padding-left"],
    ["fontSize", "font-size"],
  ];
  for (const [k, label] of numProps) {
    const dv = d[k], lv = l[k];
    if (typeof dv === "number" && typeof lv === "number") {
      const delta = +(lv - dv).toFixed(1);
      if (Math.abs(delta) >= NUM_TOL) flags.push({ prop: label, design: dv, live: lv, delta, bad: true });
    }
  }
  // gap (numeric-ish string)
  if (d.gap !== l.gap && (d.gap || l.gap)) {
    const dg = parseFloat(d.gap) || 0, lg = parseFloat(l.gap) || 0;
    if (Math.abs(lg - dg) >= NUM_TOL) flags.push({ prop: "gap", design: d.gap, live: l.gap, delta: +(lg - dg).toFixed(1), bad: true });
  }
  if (d.cols !== l.cols) flags.push({ prop: "grid columns", design: d.cols, live: l.cols, bad: true });
  if (d.display !== l.display) flags.push({ prop: "display", design: d.display, live: l.display, bad: true });
  if (d.lineHeight !== l.lineHeight) flags.push({ prop: "line-height", design: d.lineHeight, live: l.lineHeight, bad: false });
  return flags;
}

// ---------------- report ----------------
fs.writeFileSync(path.join(__dirname, "results.json"), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(__dirname, "report.html"), renderReport(results));
console.log("\nReport: visual-audit/report.html");

function rel(p) {
  return "screenshots/" + path.basename(p);
}
function esc(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function renderReport(results) {
  const catLabel = { spacing: "Spacing / padding", image: "Image placement & size", type: "Typography", component: "Component spacing" };
  const totalFlags = results.reduce((n, r) => n + r.rows.reduce((m, row) => m + row.flags.filter((f) => f.bad).length, 0), 0);

  const blocks = results
    .map((r) => {
      const badRows = r.rows.filter((row) => row.flags.some((f) => f.bad));
      const flagCount = badRows.reduce((m, row) => m + row.flags.filter((f) => f.bad).length, 0);

      const tableRows = r.rows
        .map((row) => {
          if (!row.flags.length) {
            return `<tr class="ok"><td>${esc(row.sel)}<div class="note">${esc(row.note)}</div></td><td><span class="tag ${row.cat}">${catLabel[row.cat]}</span></td><td colspan="3"><span class="match">✓ matches</span></td></tr>`;
          }
          return row.flags
            .map((f, i) => {
              const head = i === 0
                ? `<td rowspan="${row.flags.length}">${esc(row.sel)}<div class="note">${esc(row.note)}</div></td><td rowspan="${row.flags.length}"><span class="tag ${row.cat}">${catLabel[row.cat]}</span></td>`
                : "";
              const delta = f.delta != null ? `${f.delta > 0 ? "+" : ""}${f.delta}px` : "—";
              return `<tr class="${f.bad ? "bad" : "warn"}">${head}<td>${esc(f.prop)}</td><td><b>${esc(f.design)}</b> → ${esc(f.live)}</td><td class="delta">${delta}</td></tr>`;
            })
            .join("");
        })
        .join("");

      const diffNote = r.diff?.error
        ? `<span class="err">diff failed: ${esc(r.diff.error)}</span>`
        : `Overlay mismatch: <b>${r.diff?.pct}%</b> of compared pixels · compared area ${r.diff?.w}×${r.diff?.h} · design is ${Math.abs(r.diff?.heightDelta || 0)}px ${(r.diff?.heightDelta || 0) >= 0 ? "taller" : "shorter"} overall`;

      const liveErr = r.live.errors?.length ? `<div class="err">Live page errors: ${esc(r.live.errors.join("; "))}</div>` : "";

      return `
      <section class="cmp" id="${r.key}-${r.bp.key}">
        <h3>${esc(r.page)} <span class="bp">${r.bp.key} · ${r.bp.w}px</span> <span class="badge ${flagCount ? "bad" : "good"}">${flagCount} mismatches</span></h3>
        ${liveErr}
        <div class="shots">
          <figure><figcaption>Design mockup</figcaption><img loading="lazy" src="${rel(r.files.designPng)}"></figure>
          <figure><figcaption>Live site</figcaption><img loading="lazy" src="${rel(r.files.livePng)}"></figure>
          <figure><figcaption>Diff overlay <small>(red = differing pixels)</small></figcaption><img loading="lazy" src="${rel(r.files.diffPng)}"></figure>
        </div>
        <p class="diffnote">${diffNote}</p>
        <table>
          <thead><tr><th>Selector</th><th>Focus</th><th>Property</th><th>Design → Live</th><th>Δ</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </section>`;
    })
    .join("\n");

  return `<!doctype html><html><head><meta charset="utf-8"><title>The Outlayer — Visual Audit</title>
<style>
  :root{--ink:#0B1322;--line:#e5e1d6;--blue:#2F58CC;--bad:#c0392b;--good:#1e8a4c;}
  *{box-sizing:border-box}
  body{font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#13203a;margin:0;background:#f6f5f1}
  header.top{background:var(--ink);color:#F4F1E9;padding:28px 40px}
  header.top h1{margin:0 0 6px;font-size:24px}
  header.top p{margin:0;color:#9fb0d0;font-size:14px}
  .summary{display:flex;gap:16px;flex-wrap:wrap;padding:20px 40px;background:#fff;border-bottom:1px solid var(--line)}
  .summary .card{border:1px solid var(--line);border-radius:10px;padding:14px 18px;min-width:160px}
  .summary .big{font-size:28px;font-weight:700}
  .summary .lab{font-size:12px;color:#667;text-transform:uppercase;letter-spacing:.08em}
  nav.toc{padding:14px 40px;background:#fff;border-bottom:1px solid var(--line);font-size:13px}
  nav.toc a{margin-right:14px;color:var(--blue);text-decoration:none}
  main{padding:24px 40px;max-width:1500px;margin:0 auto}
  .cmp{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px;margin-bottom:28px}
  .cmp h3{margin:0 0 14px;font-size:18px;display:flex;align-items:center;gap:12px}
  .bp{font:12px/1 ui-monospace,monospace;background:#eef;color:#335;padding:4px 8px;border-radius:6px}
  .badge{font-size:12px;padding:3px 9px;border-radius:20px;color:#fff}
  .badge.bad{background:var(--bad)} .badge.good{background:var(--good)}
  .shots{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:start}
  .shots figure{margin:0;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#0B1322}
  .shots figcaption{font-size:12px;padding:6px 10px;background:#f0eee8;color:#445;border-bottom:1px solid var(--line)}
  .shots img{display:block;width:100%;height:auto}
  .diffnote{font-size:13px;color:#556;margin:12px 2px}
  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #eee;vertical-align:top}
  th{background:#faf9f6;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#667}
  tr.bad td{background:#fdf0ee}
  tr.ok .match{color:var(--good)}
  td.delta{font:13px/1 ui-monospace,monospace;font-weight:700;color:var(--bad)}
  .note{font-size:11px;color:#889;margin-top:2px}
  .tag{font-size:11px;padding:2px 7px;border-radius:5px;white-space:nowrap}
  .tag.spacing{background:#fde9d0} .tag.image{background:#d6ecff} .tag.type{background:#e5dcff} .tag.component{background:#d9f3df}
  .err{color:var(--bad);font-size:13px;margin:6px 0}
  small{color:#889}
</style></head>
<body>
<header class="top">
  <h1>The Outlayer — Visual Audit</h1>
  <p>Design mockups vs. live site · ${PAGES.length} pages × ${BREAKPOINTS.length} breakpoints · generated by Playwright</p>
</header>
<div class="summary">
  <div class="card"><div class="big">${totalFlags}</div><div class="lab">Total mismatches (≥${NUM_TOL}px)</div></div>
  <div class="card"><div class="big">${results.length}</div><div class="lab">Comparisons</div></div>
  <div class="card"><div class="lab">Legend</div><div style="margin-top:6px"><span class="tag spacing">Spacing</span> <span class="tag image">Image</span> <span class="tag type">Type</span> <span class="tag component">Component</span></div></div>
</div>
<nav class="toc">${results.map((r) => `<a href="#${r.key}-${r.bp.key}">${esc(r.page)} · ${r.bp.key}</a>`).join("")}</nav>
<main>
  <p style="font-size:13px;color:#667;max-width:80ch">
    The <b>diff overlay</b> is indicative — design tiles use hatched placeholders while the live site shows real photos,
    and dynamic copy lengths differ, so some red is expected. The authoritative comparison is the
    <b>per-selector measurement table</b>: it reads <code>getBoundingClientRect</code> and computed styles from the
    same class names on both sides and reports exact pixel deltas. Rows in red differ by ≥${NUM_TOL}px.
  </p>
  ${blocks}
</main>
</body></html>`;
}
