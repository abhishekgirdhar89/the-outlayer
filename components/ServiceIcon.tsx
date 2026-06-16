/* The four line-art service icons from the mockup, keyed by card order.
   Falls back to the first icon for any extra services. */
const ICONS = [
  // 01 — Brand & GTM (target + breakaway dot)
  <g key="0">
    <g className="spin">
      <circle className="st" cx="26" cy="30" r="15" />
      <circle className="st" cx="26" cy="30" r="8" />
    </g>
    <line className="acs" x1="34" y1="22" x2="45" y2="11" />
    <circle className="ac" cx="47" cy="9" r="4" />
  </g>,
  // 02 — Growth Marketing (axis + rising curve)
  <g key="1">
    <path className="st" d="M10 12 V44 H47" />
    <path className="acs" d="M15 39 C 26 38, 31 28, 44 13" />
    <circle className="ac" cx="45" cy="12" r="4" />
  </g>,
  // 03 — AI Automation (network of nodes)
  <g key="2">
    <line className="st" x1="14" y1="16" x2="38" y2="16" />
    <line className="st" x1="18" y1="40" x2="42" y2="40" />
    <line className="st" x1="14" y1="16" x2="18" y2="40" />
    <line className="acs" x1="38" y1="16" x2="42" y2="40" />
    <circle className="st" cx="14" cy="16" r="4" />
    <circle className="ac" cx="38" cy="16" r="4" />
    <circle className="st" cx="18" cy="40" r="4" />
    <circle className="ac" cx="42" cy="40" r="4" />
  </g>,
  // 04 — Marketing Ops (stacked blocks + connector)
  <g key="3">
    <rect className="st" x="9" y="11" width="24" height="11" rx="3" />
    <rect className="st" x="19" y="34" width="24" height="11" rx="3" />
    <path className="acs" d="M33 16 H39 a4 4 0 0 1 4 4 V34" />
    <circle className="ac" cx="43" cy="34" r="4" />
  </g>,
];

export function ServiceIcon({ index }: { index: number }) {
  const icon = ICONS[index % ICONS.length];
  return (
    <span className="svc-ill" aria-hidden="true">
      <svg viewBox="0 0 56 56">{icon}</svg>
    </span>
  );
}
