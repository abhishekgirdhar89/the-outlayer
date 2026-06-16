"use client";

import { useState } from "react";

/**
 * Admin image field with preview, file picker, optional remove, and spec hint.
 * Submits via the convention resolveImage() expects:
 *   <base> (hidden url) · <base>__file · <base>__remove
 */
export function ImageField({
  name,
  label,
  currentUrl = "",
  spec,
}: {
  name: string;
  label: string;
  currentUrl?: string;
  spec: string;
}) {
  const [preview, setPreview] = useState(currentUrl);
  const [remove, setRemove] = useState(false);
  const [error, setError] = useState("");

  const MAX_BYTES = 4 * 1024 * 1024; // 4MB — stays under Vercel's 4.5MB function body limit

  return (
    <div className="fld">
      <label>{label}</label>
      <input type="hidden" name={name} value={currentUrl} />

      {preview && !remove ? (
        <div className="img-field-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" />
        </div>
      ) : (
        <div className="img-field-empty">No image</div>
      )}

      <input
        type="file"
        name={`${name}__file`}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (f.size > MAX_BYTES) {
            setError(`That image is ${(f.size / 1024 / 1024).toFixed(1)}MB — please use one under 5MB.`);
            e.target.value = ""; // clear so it isn't submitted
            return;
          }
          setError("");
          setPreview(URL.createObjectURL(f));
          setRemove(false);
        }}
      />
      {error && <span className="field-err">{error}</span>}

      {currentUrl && (
        <label className="img-field-remove">
          <input
            type="checkbox"
            name={`${name}__remove`}
            checked={remove}
            onChange={(e) => setRemove(e.target.checked)}
          />
          Remove current image
        </label>
      )}

      <span className="hint">{spec}</span>
    </div>
  );
}
