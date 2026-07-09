import Link from "next/link";
import type { LayerStage as LayerStageType } from "@/lib/service-pages";

const MARK = (
  <svg width="28" height="28" viewBox="0 0 100 100" aria-hidden="true">
    <rect x="26" y="68" width="48" height="10" rx="3" fill="#F4F1E9" />
    <rect x="26" y="54" width="48" height="10" rx="3" fill="#F4F1E9" />
    <rect x="42" y="40" width="38" height="10" rx="3" fill="#6E9BFF" />
  </svg>
);

/** The quiet fixed nav: wordmark + a mono "back" link. Solidified on scroll by ServicePageMotion. */
export function ServiceNav({ backLabel, backHref }: { backLabel: string; backHref: string }) {
  return (
    <header className="nav" id="svc-nav">
      <div className="wrap nav-row">
        <Link className="brandline" href="/" aria-label="The Outlayer home">
          {MARK}
          <span className="nm"><span className="the">The</span>Outlayer</span>
        </Link>
        <Link className="nav-back" href={backHref}>
          <span className="ar" aria-hidden="true">←</span> {backLabel}
        </Link>
      </div>
    </header>
  );
}

/** The fixed morphing "Offset Layers" graphic. Geometry + poses are injected per page. */
export function LayerStage({ stage, firstCap }: { stage: LayerStageType; firstCap: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: stage.css }} />
      <div className="layer-stage" id="layerStage" aria-hidden="true">
        <svg
          viewBox={stage.viewBox}
          preserveAspectRatio="xMidYMid meet"
          dangerouslySetInnerHTML={{ __html: stage.svg }}
        />
        <div className="ls-cap" id="lsCap">{firstCap}</div>
      </div>
    </>
  );
}

/** Three offset-bar motifs for the content-hub cards, keyed by position (matches the prototype). */
export function ServiceCardIcon({ index }: { index: number }) {
  const i = ((index % 3) + 3) % 3;
  if (i === 0)
    return (
      <span className="ic" aria-hidden="true">
        <svg viewBox="0 0 30 30">
          <rect x="3" y="20" width="13" height="3.2" rx="1.6" transform="rotate(-7 3 20)" />
          <rect x="15" y="13" width="13" height="3.2" rx="1.6" transform="rotate(6 28 13)" />
          <rect x="6" y="7" width="11" height="3.2" rx="1.6" transform="rotate(-4 6 7)" />
          <rect className="acc" x="13.6" y="3" width="2.4" height="24" rx="1.2" />
        </svg>
      </span>
    );
  if (i === 1)
    return (
      <span className="ic" aria-hidden="true">
        <svg viewBox="0 0 30 30">
          <rect x="4" y="9" width="21" height="3.2" rx="1.6" transform="rotate(-15 15 15)" />
          <rect x="5" y="18" width="21" height="3.2" rx="1.6" transform="rotate(11 15 15)" />
          <rect className="acc" x="6" y="13.4" width="19" height="3.2" rx="1.6" transform="rotate(-3 15 15)" />
        </svg>
      </span>
    );
  return (
    <span className="ic" aria-hidden="true">
      <svg viewBox="0 0 30 30">
        <rect x="4" y="20" width="19" height="3.4" rx="1.6" />
        <rect x="4" y="14" width="19" height="3.4" rx="1.6" />
        <rect className="acc" x="11" y="7" width="17" height="3.4" rx="1.6" />
      </svg>
    </span>
  );
}

/** Render a proof stat's value, tinting a leading "$" and the trailing unit blue. */
export function StatValue({ value, unit }: { value: string; unit?: string }) {
  const hasDollar = value.startsWith("$");
  const rest = hasDollar ? value.slice(1) : value;
  return (
    <div className="big">
      {hasDollar && <span className="u">$</span>}
      {rest}
      {unit ? <span className="u">{unit}</span> : null}
    </div>
  );
}
