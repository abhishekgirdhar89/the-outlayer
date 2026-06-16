// Shared config for the visual audit.
export const DESIGN_DIR = "/Users/abhishekgirdhar/Documents/The Outlayer/HTML Files";
export const BASE = "http://localhost:3000";

export const BREAKPOINTS = [
  { key: "mobile", w: 390, h: 844 },
  { key: "tablet", w: 768, h: 1024 },
  { key: "desktop", w: 1280, h: 900 },
];

// Each measured selector is tagged with a focus category so the report can
// group findings: spacing | image | type | component.
const COMMON = [
  { sel: ".wrap", cat: "spacing", note: "Page gutter (padding)" },
  { sel: "header.top .top-row", cat: "component", note: "Nav bar height" },
  { sel: ".btn-primary", cat: "component", note: "Primary button" },
];

export const PAGES = [
  {
    key: "home",
    name: "Homepage",
    design: `${DESIGN_DIR}/The Outlayer - Homepage (standalone).html`,
    live: `${BASE}/`,
    ready: "header.top",
    selectors: [
      ...COMMON,
      { sel: ".hero .wrap", cat: "spacing", note: "Hero grid (padding/gap/cols)" },
      { sel: ".hero h1", cat: "type", note: "Hero headline" },
      { sel: ".hero .sub", cat: "type", note: "Hero subtitle" },
      { sel: ".hero-figure", cat: "image", note: "Hero figure box" },
      { sel: ".sec", cat: "spacing", note: "Section vertical padding" },
      { sel: ".about-photo", cat: "image", note: "About photo box" },
      { sel: ".about-stats", cat: "component", note: "Stats grid columns" },
      { sel: ".svc-grid", cat: "component", note: "Services grid (gap/cols)" },
      { sel: ".svc", cat: "spacing", note: "Service card padding" },
      { sel: ".work-list", cat: "component", note: "Work grid (gap/cols)" },
      { sel: ".work-row", cat: "image", note: "Work tile box" },
      { sel: ".quotes", cat: "component", note: "Testimonials grid" },
      { sel: ".writing", cat: "component", note: "Writing grid" },
      { sel: ".art-img", cat: "image", note: "Article card image box" },
    ],
  },
  {
    key: "insights",
    name: "Insights listing",
    design: `${DESIGN_DIR}/The Outlayer - Insights (standalone).html`,
    live: `${BASE}/insights`,
    ready: ".lhead",
    selectors: [
      ...COMMON,
      { sel: ".lhead .wrap", cat: "spacing", note: "Header grid (padding/gap/cols)" },
      { sel: ".lhead h1", cat: "type", note: "Header headline" },
      { sel: ".filters .wrap", cat: "component", note: "Filter bar height" },
      { sel: ".chip", cat: "component", note: "Filter chip" },
      { sel: ".feat", cat: "component", note: "Featured card (cols)" },
      { sel: ".feat .f-img", cat: "image", note: "Featured image box" },
      { sel: ".feat .f-body", cat: "spacing", note: "Featured body padding" },
      { sel: ".writing", cat: "component", note: "Grid (gap/cols)" },
      { sel: ".art-img", cat: "image", note: "Article image box" },
    ],
  },
  {
    key: "post",
    name: "Article detail",
    design: `${DESIGN_DIR}/The Outlayer - Insight, Strategy That Gets Built (standalone).html`,
    live: `${BASE}/insights/strategy-that-gets-built`,
    ready: ".d-prose",
    selectors: [
      ...COMMON,
      { sel: ".d-head h1", cat: "type", note: "Title" },
      { sel: ".d-head .dek", cat: "type", note: "Dek" },
      { sel: ".d-fig.lead-fig", cat: "image", note: "In-prose lead figure" },
      { sel: ".d-main", cat: "component", note: "Body+rail grid (gap/cols)" },
      { sel: ".d-prose", cat: "type", note: "Prose column (width/size)" },
      { sel: ".d-prose .intro", cat: "type", note: "Intro paragraph" },
      { sel: ".d-prose h2", cat: "type", note: "Section heading" },
      { sel: ".rel-grid", cat: "component", note: "Related grid" },
    ],
  },
];

// Numeric props compared with a px tolerance; string props compared exactly.
export const NUM_TOL = 2; // px
