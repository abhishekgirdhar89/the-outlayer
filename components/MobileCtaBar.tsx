import Link from "next/link";

/** Sticky bottom action bar shown only on mobile (matches the mockups). */
export function MobileCtaBar({
  label = "Book a working session",
  href = "/#enquiry",
}: {
  label?: string;
  href?: string;
}) {
  return (
    <div className="mobile-cta-bar" aria-label="Quick actions">
      <Link className="btn btn-primary" href={href}>
        {label}
      </Link>
      <a className="btn btn-ghost-dk ic" href="mailto:hello@theoutlayer.com" aria-label="Email">
        ✉
      </a>
    </div>
  );
}
