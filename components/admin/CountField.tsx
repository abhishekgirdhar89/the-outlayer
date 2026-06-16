"use client";

import { useState } from "react";

/**
 * Text field that shows a live character/word count and a suggested length
 * (derived from the original placeholder content). Guides, never restricts.
 */
export function CountField({
  name,
  label,
  defaultValue = "",
  rows,
  guide,
  placeholder,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  guide?: number;
  placeholder?: string;
  hint?: string;
}) {
  const [val, setVal] = useState(defaultValue);
  const chars = val.length;
  const words = val.trim() ? val.trim().split(/\s+/).length : 0;
  const over = !!guide && chars > Math.round(guide * 1.3);

  return (
    <div className="fld">
      <label>{label}</label>
      {rows ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
        />
      )}
      <div className="count-hint">
        <span>{hint ?? ""}</span>
        <span className={over ? "over" : ""}>
          {chars} chars · {words} words{guide ? ` · ~${guide} suggested` : ""}
        </span>
      </div>
    </div>
  );
}
