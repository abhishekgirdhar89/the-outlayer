export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg className="mk" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="26" y="68" width="48" height="10" rx="3" fill="#F4F1E9" />
      <rect x="26" y="54" width="48" height="10" rx="3" fill="#F4F1E9" />
      <rect x="42" y="40" width="38" height="10" rx="3" fill="#6E9BFF" />
    </svg>
  );
}

export function Wordmark({ name = "The Outlayer" }: { name?: string }) {
  const [first, ...rest] = name.trim().split(/\s+/);
  if (first?.toLowerCase() === "the" && rest.length) {
    return (
      <span className="nm">
        <span className="the">{first}</span>
        {rest.join(" ")}
      </span>
    );
  }
  return <span className="nm">{name}</span>;
}
