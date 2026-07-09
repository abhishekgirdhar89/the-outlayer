"use client";

import { useState } from "react";

type Col = { key: string; label: string; textarea?: boolean; placeholder?: string };
type Row = Record<string, string>;

/**
 * Edits an array of flat objects (e.g. how-it-works steps, content-hub cards,
 * proof stats) as add/remove/reorder rows, serialising to a hidden JSON input
 * named `name` so a plain server action can JSON.parse it. Keeps the admin
 * friendly for repeatable content without a JSON textarea.
 */
export function Repeater({
  name,
  label,
  columns,
  value,
  addLabel = "Add row",
  hint,
}: {
  name: string;
  label: string;
  columns: Col[];
  value: Row[];
  addLabel?: string;
  hint?: string;
}) {
  const blank = (): Row => Object.fromEntries(columns.map((c) => [c.key, ""]));
  const [rows, setRows] = useState<Row[]>(value.length ? value.map((r) => ({ ...blank(), ...r })) : []);

  const set = (i: number, key: string, v: string) =>
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: v } : r)));
  const add = () => setRows((rs) => [...rs, blank()]);
  const remove = (i: number) => setRows((rs) => rs.filter((_, ri) => ri !== i));
  const move = (i: number, dir: -1 | 1) =>
    setRows((rs) => {
      const j = i + dir;
      if (j < 0 || j >= rs.length) return rs;
      const copy = [...rs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  return (
    <div className="fld">
      <label>{label}</label>
      {hint && <span className="hint" style={{ marginBottom: 10, display: "block" }}>{hint}</span>}
      <input type="hidden" name={name} value={JSON.stringify(rows)} />

      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--bd)",
            borderRadius: 10,
            padding: 14,
            marginBottom: 10,
            background: "rgba(11,19,34,0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span className="hint" style={{ fontSize: 11 }}>#{i + 1}</span>
            <span style={{ display: "flex", gap: 8 }}>
              <button type="button" className="linklike" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="linklike" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>↓</button>
              <button type="button" className="linklike" onClick={() => remove(i)} style={{ color: "#F0857E" }}>Remove</button>
            </span>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {columns.map((c) => (
              <div key={c.key}>
                <label style={{ fontSize: 11, color: "rgba(244,241,233,0.55)", display: "block", marginBottom: 5 }}>
                  {c.label}
                </label>
                {c.textarea ? (
                  <textarea
                    rows={2}
                    value={r[c.key] ?? ""}
                    placeholder={c.placeholder}
                    onChange={(e) => set(i, c.key, e.target.value)}
                  />
                ) : (
                  <input
                    value={r[c.key] ?? ""}
                    placeholder={c.placeholder}
                    onChange={(e) => set(i, c.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-ghost-dk" onClick={add} style={{ padding: "9px 16px", fontSize: 13 }}>
        {addLabel}
      </button>
    </div>
  );
}
