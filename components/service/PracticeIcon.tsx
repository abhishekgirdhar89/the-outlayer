/** Line-art icons for the header Practice mega-menu, keyed by service slug. */
export function PracticeIcon({ slug }: { slug: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 22,
    height: 22,
  };
  switch (slug) {
    case "fractional-cmo":
      return (
        <svg {...common}>
          <line x1="5" y1="17" x2="16" y2="17" />
          <line x1="5" y1="12.5" x2="16" y2="12.5" />
          <line className="pi-accent" x1="9" y1="8" x2="19" y2="8" />
        </svg>
      );
    case "go-to-market":
      return (
        <svg {...common}>
          <circle cx="11.5" cy="12.5" r="6.5" />
          <circle className="pi-accent" cx="11.5" cy="12.5" r="2.3" />
          <line className="pi-accent" x1="11.5" y1="12.5" x2="19" y2="5" />
        </svg>
      );
    case "growth-marketing":
      return (
        <svg {...common}>
          <polyline points="4,17.5 9.5,12 13,15 20,7" />
          <polyline className="pi-accent" points="15,7 20,7 20,12" />
        </svg>
      );
    case "ai-automation":
      return (
        <svg {...common}>
          <rect x="6.5" y="6.5" width="11" height="11" rx="2.4" />
          <circle className="pi-accent" cx="17.5" cy="6.5" r="1.9" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <line x1="5" y1="17" x2="16" y2="17" />
          <line x1="5" y1="12.5" x2="16" y2="12.5" />
          <line className="pi-accent" x1="9" y1="8" x2="19" y2="8" />
        </svg>
      );
  }
}
