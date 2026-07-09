/**
 * LayerStage geometry + pose choreography, per service page.
 *
 * This is the ONE part of a service page that is code, not CMS content: the
 * "Offset Layers" SVG and the transforms it morphs through as the reader
 * scrolls. Each page tells a different metaphor with the same three-bar
 * vocabulary, so the geometry differs per slug. Captions and all copy stay
 * editable in the DB (service_pages.panels[].cap); only the drawing lives here.
 *
 * `svg` is the inner markup of `.layer-stage svg`. `css` is injected into a
 * scoped <style> on the page — it carries the page-specific bar fills, the
 * drawn trajectory, and the `.pose-1 … .pose-N` transforms. Every selector is
 * prefixed with `.page-services` so it can never leak to another page.
 */
export type LayerStage = { viewBox: string; svg: string; css: string };

export const LAYER_STAGES: Record<string, LayerStage> = {
  // ---------- Fractional CMO — scattered pieces held into one whole ----------
  "fractional-cmo": {
    viewBox: "0 0 400 300",
    svg: `<path class="ls-path" d="M205 150 L205 292"></path>
<rect class="bar base base2" x="110" y="250" width="190" height="30" rx="9"></rect>
<rect class="bar base base1" x="110" y="210" width="190" height="30" rx="9"></rect>
<rect class="bar top" x="150" y="170" width="150" height="30" rx="9"></rect>`,
    css: `
.page-services .layer-stage .bar{transition:transform 1.05s cubic-bezier(.2,.7,.2,1), opacity .7s ease; transform-box:fill-box; transform-origin:center;}
.page-services .layer-stage .base{fill:#EAF0FA;}
.page-services .layer-stage .top{fill:var(--sec-blue);}
.page-services .layer-stage .ls-path{fill:none; stroke:rgba(110,155,255,0.7); stroke-width:2.4; stroke-linecap:round; stroke-dasharray:150; stroke-dashoffset:150; opacity:0; transition:stroke-dashoffset 1.05s cubic-bezier(.3,.7,.2,1) .1s, opacity .4s ease;}
.page-services .layer-stage.pose-1 .top{transform:translateX(-20px);}
.page-services .layer-stage.pose-2 .base2{transform:translate(-66px,26px) rotate(-8deg);}
.page-services .layer-stage.pose-2 .base1{transform:translate(58px,-8px) rotate(7deg);}
.page-services .layer-stage.pose-2 .top{transform:translate(4px,-58px) rotate(-13deg);}
.page-services .layer-stage.pose-2 .base{opacity:.48;}
.page-services .layer-stage.pose-3 .base2{transform:translate(-66px,26px) rotate(-8deg);}
.page-services .layer-stage.pose-3 .base1{transform:translate(58px,-8px) rotate(7deg);}
.page-services .layer-stage.pose-3 .top{transform:translate(4px,-58px) rotate(-13deg);}
.page-services .layer-stage.pose-3 .base{opacity:.48;}
.page-services .layer-stage.pose-3 .ls-path{opacity:1; stroke-dashoffset:0;}
.page-services .layer-stage.pose-4 .base2{transform:translate(-22px,12px) rotate(-3deg);}
.page-services .layer-stage.pose-4 .base1{transform:translate(18px,6px) rotate(2deg);}
.page-services .layer-stage.pose-4 .top{transform:translate(-4px,-20px) rotate(-3deg);}
.page-services .layer-stage.pose-4 .base{opacity:.8;}
.page-services .layer-stage.pose-4 .ls-path{opacity:1; stroke-dashoffset:0;}
.page-services .layer-stage.pose-5 .top{transform:translateX(40px);}`,
  },

  // ---------- AI Systems — loose tools locking into a running chain ----------
  "ai-automation": {
    viewBox: "0 0 400 340",
    svg: `<path class="chain" d="M250 175 H108 V225 H272 V275 H108"></path>
<g class="stack">
<rect class="bar link l1" x="104" y="185" width="8" height="30" rx="4"></rect>
<rect class="bar link l2" x="268" y="235" width="8" height="30" rx="4"></rect>
<rect class="bar base base1" x="100" y="260" width="180" height="30" rx="9"></rect>
<rect class="bar base base2" x="100" y="210" width="180" height="30" rx="9"></rect>
<rect class="bar top" x="100" y="160" width="150" height="30" rx="9"></rect>
</g>`,
    css: `
.page-services .layer-stage .bar{transition:transform 1.05s cubic-bezier(.2,.7,.2,1), opacity .7s ease; transform-box:fill-box; transform-origin:center;}
.page-services .layer-stage .base{fill:#EAF0FA;}
.page-services .layer-stage .top{fill:var(--sec-blue);}
.page-services .layer-stage .link{fill:rgba(157,176,206,0.55); opacity:0; transition:opacity .7s ease, fill .7s ease;}
.page-services .layer-stage .chain{fill:none; stroke:var(--sec-blue); stroke-width:3; stroke-linecap:round; stroke-linejoin:round; opacity:0; transition:opacity .5s ease;}
.page-services .layer-stage.pose-1 .top{transform:translateX(34px);}
.page-services .layer-stage.pose-2 .top{transform:translate(78px,-92px);}
.page-services .layer-stage.pose-3 .top{transform:translate(24px,-14px);}
.page-services .layer-stage.pose-3 .link{opacity:.5; fill:rgba(157,176,206,0.55);}
.page-services .layer-stage.pose-4 .top{transform:translateX(0);}
.page-services .layer-stage.pose-4 .link{opacity:1; fill:var(--sec-blue);}
.page-services .layer-stage.pose-4 .chain{opacity:.4;}
.page-services .layer-stage.pose-5 .top{transform:translateX(0);}
.page-services .layer-stage.pose-5 .link{opacity:1; fill:var(--sec-blue);}
.page-services .layer-stage.pose-5 .chain{opacity:.9; stroke-dasharray:44 528; animation:chainrun 3s linear infinite;}
@keyframes chainrun{from{stroke-dashoffset:572;} to{stroke-dashoffset:0;}}
@media (prefers-reduced-motion:reduce){ .page-services .layer-stage.pose-5 .chain{animation:none;} }`,
  },

  // ---------- Brand & Go-to-Market — the filed plan, relaunched ----------
  "go-to-market": {
    viewBox: "0 0 400 300",
    svg: `<path class="ls-path" d="M300 175 C 358 150, 392 96, 404 20"></path>
<rect class="bar base base2" x="110" y="250" width="190" height="30" rx="9"></rect>
<rect class="bar base base1" x="110" y="210" width="190" height="30" rx="9"></rect>
<rect class="bar top" x="150" y="170" width="150" height="30" rx="9"></rect>`,
    css: `
.page-services .layer-stage .bar{transition:transform .95s cubic-bezier(.2,.7,.2,1), opacity .7s ease; transform-box:fill-box; transform-origin:center;}
.page-services .layer-stage .base{fill:#EAF0FA;}
.page-services .layer-stage .top{fill:var(--sec-blue);}
.page-services .layer-stage .ls-path{fill:none; stroke:rgba(110,155,255,0.55); stroke-width:2.4; stroke-linecap:round; stroke-dasharray:340; stroke-dashoffset:340; opacity:0; transition:stroke-dashoffset 1.15s cubic-bezier(.3,.7,.2,1) .12s, opacity .4s ease;}
.page-services .layer-stage svg{transition:transform .95s cubic-bezier(.2,.7,.2,1);}
.page-services .layer-stage.pose-1 .top{transform:translateX(40px);}
.page-services .layer-stage.pose-2 svg{transform:rotate(-3deg) scale(.94);}
.page-services .layer-stage.pose-2 .bar{opacity:.42;}
.page-services .layer-stage.pose-2 .base1{transform:translateY(20px);}
.page-services .layer-stage.pose-2 .top{transform:translate(40px,60px);}
.page-services .layer-stage.pose-3 .top{transform:translateX(40px);}
.page-services .layer-stage.pose-4 .top{transform:translate(40px,-48px);}
.page-services .layer-stage.pose-4 .base1{transform:translateY(6px);}
.page-services .layer-stage.pose-5 .base{opacity:.26;}
.page-services .layer-stage.pose-5 .top{transform:translateX(40px); opacity:1;}
.page-services .layer-stage.pose-7 .base{opacity:.28;}
.page-services .layer-stage.pose-7 .top{transform:translate(120px,-150px) rotate(-12deg) scale(.86); opacity:1;}
.page-services .layer-stage.pose-7 .ls-path{opacity:1; stroke-dashoffset:0;}`,
  },

  // ---------- Growth Marketing — flood the top, find the constraint, rise ----------
  "growth-marketing": {
    viewBox: "0 0 400 320",
    svg: `<path class="ls-path" d="M200 210 C 296 172, 356 112, 392 30"></path>
<g class="stack">
<rect class="bar flood flood2" x="150" y="116" width="150" height="26" rx="8"></rect>
<rect class="bar flood flood1" x="150" y="144" width="150" height="26" rx="8"></rect>
<rect class="bar base base2" x="110" y="250" width="190" height="30" rx="9"></rect>
<rect class="bar base base1" x="110" y="210" width="190" height="30" rx="9"></rect>
<rect class="bar top" x="150" y="170" width="150" height="30" rx="9"></rect>
</g>`,
    css: `
.page-services .layer-stage .bar{transition:transform .95s cubic-bezier(.2,.7,.2,1), opacity .7s ease; transform-box:fill-box; transform-origin:center;}
.page-services .layer-stage .stack{transition:transform 1.05s cubic-bezier(.2,.7,.2,1);}
.page-services .layer-stage .base{fill:#EAF0FA;}
.page-services .layer-stage .flood{fill:#EAF0FA; opacity:0;}
.page-services .layer-stage .top{fill:var(--sec-blue);}
.page-services .layer-stage .ls-path{fill:none; stroke:rgba(110,155,255,0.55); stroke-width:2.4; stroke-linecap:round; stroke-dasharray:360; stroke-dashoffset:360; opacity:0; transition:stroke-dashoffset 1.2s cubic-bezier(.3,.7,.2,1) .18s, opacity .4s ease;}
.page-services .layer-stage.pose-1 .top{transform:translateX(40px);}
.page-services .layer-stage.pose-2 .top{transform:translateX(40px);}
.page-services .layer-stage.pose-2 .flood1{opacity:.36; transform:translateX(40px);}
.page-services .layer-stage.pose-2 .flood2{opacity:.30; transform:translateX(40px);}
.page-services .layer-stage.pose-3 .top{transform:translate(90px,18px) rotate(7deg); opacity:1;}
.page-services .layer-stage.pose-3 .flood1{opacity:.18; transform:translate(44px,-4px) rotate(4deg);}
.page-services .layer-stage.pose-3 .flood2{opacity:.14; transform:translate(58px,-12px) rotate(6deg);}
.page-services .layer-stage.pose-4 .base{opacity:.32;}
.page-services .layer-stage.pose-4 .base1{transform:translateY(14px);}
.page-services .layer-stage.pose-4 .base2{transform:translateY(30px);}
.page-services .layer-stage.pose-4 .flood1{opacity:.22; transform:translateY(-14px);}
.page-services .layer-stage.pose-4 .flood2{opacity:.18; transform:translateY(-28px);}
.page-services .layer-stage.pose-4 .top{transform:translate(40px,-6px); opacity:1;}
.page-services .layer-stage.pose-5 .base{opacity:.24;}
.page-services .layer-stage.pose-5 .top{transform:translateX(40px); opacity:1;}
.page-services .layer-stage.pose-6 .base{opacity:.42;}
.page-services .layer-stage.pose-6 .top{transform:translateX(40px); opacity:1;}
.page-services .layer-stage.pose-7 .base{opacity:.55;}
.page-services .layer-stage.pose-7 .top{transform:translateX(40px); opacity:1;}
.page-services .layer-stage.pose-7 .stack{transform:translate(126px,-150px) scale(.9);}
.page-services .layer-stage.pose-7 .ls-path{opacity:1; stroke-dashoffset:0;}`,
  },
};

/** All four slugs, in the order the practice ranks them. */
export const SERVICE_SLUGS = ["fractional-cmo", "ai-automation", "go-to-market", "growth-marketing"] as const;

export function getLayerStage(slug: string): LayerStage {
  return LAYER_STAGES[slug] ?? LAYER_STAGES["fractional-cmo"];
}
