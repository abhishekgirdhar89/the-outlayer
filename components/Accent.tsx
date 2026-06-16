import { Fragment } from "react";

/**
 * Renders text with *asterisk-wrapped* spans as <em> — which the design system
 * styles as the bright-blue accent used across all headings in the mockups.
 * e.g. "Strategy that gets *built.*" → Strategy that gets <em>built.</em>
 */
export function Accent({ text }: { text: string }) {
  const parts = (text ?? "").split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.length > 1 && p.startsWith("*") && p.endsWith("*") ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}
