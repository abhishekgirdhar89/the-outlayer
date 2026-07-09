"use client";

import { useMemo, useState } from "react";
import type { ServiceFlow, ServiceFlowNode } from "@/lib/types";

const lbl = { fontSize: 11, color: "rgba(244,241,233,0.55)", display: "block", marginBottom: 5 } as const;
const sub = { border: "1px solid var(--bd)", borderRadius: 9, padding: 10, marginBottom: 8, background: "rgba(11,19,34,0.4)" } as const;
const row = { display: "flex", gap: 8, alignItems: "center" } as const;

const EMPTY: ServiceFlow = { tag: "", head: "", sub: "", capLeft: "", capRight: "", foot: "", nodes: [] };

export function FlowEditor({ name, value }: { name: string; value: ServiceFlow | null }) {
  const [enabled, setEnabled] = useState(!!value);
  const [flow, setFlow] = useState<ServiceFlow>(value ?? EMPTY);

  const set = (patch: Partial<ServiceFlow>) => setFlow((f) => ({ ...f, ...patch }));
  const setNode = (i: number, patch: Partial<ServiceFlowNode>) =>
    setFlow((f) => ({ ...f, nodes: f.nodes.map((n, ni) => (ni === i ? { ...n, ...patch } : n)) }));
  const addNode = () => setFlow((f) => ({ ...f, nodes: [...f.nodes, { stat: "running", title: "", desc: "", lit: false }] }));
  const removeNode = (i: number) => setFlow((f) => ({ ...f, nodes: f.nodes.filter((_, ni) => ni !== i) }));

  const serialized = useMemo(() => (enabled ? JSON.stringify(flow) : ""), [enabled, flow]);

  return (
    <div className="fld">
      <input type="hidden" name={name} value={serialized} />
      <label style={{ ...row, fontSize: 13, marginBottom: enabled ? 14 : 0 }}>
        <input type="checkbox" style={{ width: "auto" }} checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        This page has a system-flow diagram
      </label>

      {enabled && (
        <>
          <div className="fld-row">
            <div className="fld">
              <label style={lbl}>Section kicker</label>
              <input value={flow.tag} onChange={(e) => set({ tag: e.target.value })} placeholder="What a system looks like" />
            </div>
            <div className="fld">
              <label style={lbl}>Heading</label>
              <input value={flow.head} onChange={(e) => set({ head: e.target.value })} />
            </div>
          </div>
          <div className="fld">
            <label style={lbl}>Sub-line</label>
            <textarea rows={2} value={flow.sub} onChange={(e) => set({ sub: e.target.value })} />
          </div>
          <div className="fld-row">
            <div className="fld">
              <label style={lbl}>Left caption (automated side)</label>
              <input value={flow.capLeft} onChange={(e) => set({ capLeft: e.target.value })} placeholder="Automated, always running" />
            </div>
            <div className="fld">
              <label style={lbl}>Right caption (human side)</label>
              <input value={flow.capRight} onChange={(e) => set({ capRight: e.target.value })} placeholder="The judgment stays mine" />
            </div>
          </div>
          <div className="fld">
            <label style={lbl}>Footer line</label>
            <input value={flow.foot} onChange={(e) => set({ foot: e.target.value })} placeholder="then it publishes to the blog and LinkedIn" />
          </div>

          <div className="fld">
            <label style={lbl}>Nodes (each step in the flow, left to right)</label>
            {flow.nodes.map((n, i) => (
              <div key={i} style={sub}>
                <div style={{ ...row, marginBottom: 6 }}>
                  <input style={{ width: 130 }} value={n.stat} placeholder="Status (running/you)" onChange={(e) => setNode(i, { stat: e.target.value })} />
                  <input style={{ flex: 1 }} value={n.title} placeholder="Node title" onChange={(e) => setNode(i, { title: e.target.value })} />
                  <label style={{ ...row, fontSize: 12, whiteSpace: "nowrap" }}>
                    <input type="checkbox" style={{ width: "auto" }} checked={!!n.lit} onChange={(e) => setNode(i, { lit: e.target.checked })} />
                    lit (human)
                  </label>
                  <button type="button" className="linklike" style={{ color: "#F0857E" }} onClick={() => removeNode(i)}>×</button>
                </div>
                <input value={n.desc} placeholder="Short description" onChange={(e) => setNode(i, { desc: e.target.value })} />
              </div>
            ))}
            <button type="button" className="linklike" onClick={addNode}>+ Add node</button>
          </div>
        </>
      )}
    </div>
  );
}
