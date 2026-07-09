"use client";

import { useMemo, useState } from "react";
import type { StoryPanel, PanelLine, PanelRow } from "@/lib/types";

type EditPanel = {
  pose: number;
  cap: string;
  variant: "head" | "open" | "mid";
  tag: string;
  head: string;
  sub: string;
  lines: PanelLine[];
  rows: PanelRow[];
  hasCols: boolean;
  builtText: string;
  notForText: string;
};

function toEdit(p: StoryPanel): EditPanel {
  return {
    pose: p.pose ?? 1,
    cap: p.cap ?? "",
    variant: (p.variant as EditPanel["variant"]) ?? "head",
    tag: p.tag ?? "",
    head: p.head ?? "",
    sub: p.sub ?? "",
    lines: p.lines ?? [],
    rows: p.rows ?? [],
    hasCols: !!p.cols,
    builtText: (p.cols?.built ?? []).join("\n"),
    notForText: (p.cols?.notFor ?? []).join("\n"),
  };
}

const card = { border: "1px solid var(--bd)", borderRadius: 12, padding: 16, marginBottom: 14, background: "rgba(11,19,34,0.35)" } as const;
const sub = { border: "1px solid var(--bd)", borderRadius: 9, padding: 10, marginBottom: 8, background: "rgba(11,19,34,0.4)" } as const;
const lbl = { fontSize: 11, color: "rgba(244,241,233,0.55)", display: "block", marginBottom: 5 } as const;
const row = { display: "flex", gap: 8, alignItems: "center" } as const;

export function PanelsEditor({ name, value }: { name: string; value: StoryPanel[] }) {
  const [panels, setPanels] = useState<EditPanel[]>(value.map(toEdit));

  const upd = (i: number, patch: Partial<EditPanel>) =>
    setPanels((ps) => ps.map((p, pi) => (pi === i ? { ...p, ...patch } : p)));
  const addPanel = () =>
    setPanels((ps) => [...ps, { pose: 1, cap: "", variant: "head", tag: "", head: "", sub: "", lines: [], rows: [], hasCols: false, builtText: "", notForText: "" }]);
  const removePanel = (i: number) => setPanels((ps) => ps.filter((_, pi) => pi !== i));
  const movePanel = (i: number, d: -1 | 1) =>
    setPanels((ps) => {
      const j = i + d;
      if (j < 0 || j >= ps.length) return ps;
      const c = [...ps];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });

  // serialize → clean StoryPanel[] for the hidden input
  const serialized = useMemo(() => {
    const out: StoryPanel[] = panels.map((p) => {
      const o: StoryPanel = { pose: Number(p.pose) || 1 };
      if (p.cap) o.cap = p.cap;
      if (p.variant) o.variant = p.variant;
      if (p.tag) o.tag = p.tag;
      if (p.head) o.head = p.head;
      if (p.sub) o.sub = p.sub;
      const lines = p.lines.filter((l) => l.text.trim());
      if (lines.length) o.lines = lines;
      const rows = p.rows.filter((r) => r.name.trim() || r.desc.trim());
      if (rows.length) o.rows = rows;
      if (p.hasCols) {
        const built = p.builtText.split("\n").map((s) => s.trim()).filter(Boolean);
        const notFor = p.notForText.split("\n").map((s) => s.trim()).filter(Boolean);
        o.cols = { built, notFor };
      }
      return o;
    });
    return JSON.stringify(out);
  }, [panels]);

  return (
    <div className="fld">
      <input type="hidden" name={name} value={serialized} />

      {panels.map((p, i) => (
        <div key={i} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontFamily: "var(--display)" }}>Panel {i + 1}</strong>
            <span style={{ display: "flex", gap: 8 }}>
              <button type="button" className="linklike" onClick={() => movePanel(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="linklike" onClick={() => movePanel(i, 1)} disabled={i === panels.length - 1}>↓</button>
              <button type="button" className="linklike" onClick={() => removePanel(i)} style={{ color: "#F0857E" }}>Remove</button>
            </span>
          </div>

          <div className="fld-row">
            <div className="fld">
              <label style={lbl}>Graphic pose (1–7)</label>
              <input type="number" min={1} max={7} value={p.pose} onChange={(e) => upd(i, { pose: parseInt(e.target.value, 10) || 1 })} />
            </div>
            <div className="fld">
              <label style={lbl}>Headline style</label>
              <select value={p.variant} onChange={(e) => upd(i, { variant: e.target.value as EditPanel["variant"] })}>
                <option value="head">Head (big statement)</option>
                <option value="open">Open (movement opener)</option>
                <option value="mid">Mid (leads a list)</option>
              </select>
            </div>
            <div className="fld">
              <label style={lbl}>Graphic caption</label>
              <input value={p.cap} onChange={(e) => upd(i, { cap: e.target.value })} placeholder="the whole, at rest" />
            </div>
          </div>

          <div className="fld">
            <label style={lbl}>Kicker (small mono line, optional)</label>
            <input value={p.tag} onChange={(e) => upd(i, { tag: e.target.value })} placeholder="The non-obvious move" />
          </div>
          <div className="fld">
            <label style={lbl}>Headline (wrap a word in *asterisks* to accent it blue)</label>
            <textarea rows={2} value={p.head} onChange={(e) => upd(i, { head: e.target.value })} />
          </div>
          <div className="fld">
            <label style={lbl}>Supporting paragraph (optional)</label>
            <textarea rows={2} value={p.sub} onChange={(e) => upd(i, { sub: e.target.value })} />
          </div>

          {/* stacked lines */}
          <div className="fld">
            <label style={lbl}>Stacked lines (optional — used by opener panels)</label>
            {p.lines.map((l, li) => (
              <div key={li} style={{ ...sub, ...row }}>
                <input
                  style={{ flex: 1 }}
                  value={l.text}
                  placeholder="A line of the story…"
                  onChange={(e) => upd(i, { lines: p.lines.map((x, xi) => (xi === li ? { ...x, text: e.target.value } : x)) })}
                />
                <label style={{ ...row, fontSize: 12, whiteSpace: "nowrap" }}>
                  <input type="checkbox" style={{ width: "auto" }} checked={!!l.strong}
                    onChange={(e) => upd(i, { lines: p.lines.map((x, xi) => (xi === li ? { ...x, strong: e.target.checked } : x)) })} />
                  bold
                </label>
                <button type="button" className="linklike" style={{ color: "#F0857E" }}
                  onClick={() => upd(i, { lines: p.lines.filter((_, xi) => xi !== li) })}>×</button>
              </div>
            ))}
            <button type="button" className="linklike" onClick={() => upd(i, { lines: [...p.lines, { text: "", strong: false }] })}>+ Add line</button>
          </div>

          {/* symptom rows */}
          <div className="fld">
            <label style={lbl}>List rows (optional — the “symptoms” list)</label>
            {p.rows.map((r, ri) => (
              <div key={ri} style={sub}>
                <div style={{ ...row, marginBottom: 6 }}>
                  <input style={{ flex: 1 }} value={r.name} placeholder="Row title"
                    onChange={(e) => upd(i, { rows: p.rows.map((x, xi) => (xi === ri ? { ...x, name: e.target.value } : x)) })} />
                  <label style={{ ...row, fontSize: 12, whiteSpace: "nowrap" }}>
                    <input type="checkbox" style={{ width: "auto" }} checked={!!r.hot}
                      onChange={(e) => upd(i, { rows: p.rows.map((x, xi) => (xi === ri ? { ...x, hot: e.target.checked } : x)) })} />
                    highlight
                  </label>
                  <button type="button" className="linklike" style={{ color: "#F0857E" }}
                    onClick={() => upd(i, { rows: p.rows.filter((_, xi) => xi !== ri) })}>×</button>
                </div>
                <textarea rows={2} value={r.desc} placeholder="Row description"
                  onChange={(e) => upd(i, { rows: p.rows.map((x, xi) => (xi === ri ? { ...x, desc: e.target.value } : x)) })} />
              </div>
            ))}
            <button type="button" className="linklike" onClick={() => upd(i, { rows: [...p.rows, { name: "", desc: "", hot: false }] })}>+ Add row</button>
          </div>

          {/* who-this-is-for columns */}
          <div className="fld">
            <label style={{ ...row, fontSize: 13 }}>
              <input type="checkbox" style={{ width: "auto" }} checked={p.hasCols} onChange={(e) => upd(i, { hasCols: e.target.checked })} />
              “Who this is for” two-column block
            </label>
            {p.hasCols && (
              <div className="fld-row" style={{ marginTop: 8 }}>
                <div className="fld">
                  <label style={lbl}>Built for (one per line)</label>
                  <textarea rows={3} value={p.builtText} onChange={(e) => upd(i, { builtText: e.target.value })} />
                </div>
                <div className="fld">
                  <label style={lbl}>Not for (one per line)</label>
                  <textarea rows={3} value={p.notForText} onChange={(e) => upd(i, { notForText: e.target.value })} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-ghost-dk" onClick={addPanel} style={{ padding: "9px 16px", fontSize: 13 }}>
        + Add panel
      </button>
    </div>
  );
}
