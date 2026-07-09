import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

/** Sticky bottom action bar shown only on mobile (matches the mockups).
 *  The email icon uses the editable public contact email (Admin → Header & Footer). */
export async function MobileCtaBar({
  label = "Book a working session",
  href = "/#enquiry",
}: {
  label?: string;
  href?: string;
}) {
  const settings = await getSiteSettings();
  const email = (settings.contact_email || "").trim();
  return (
    <div className="mobile-cta-bar" aria-label="Quick actions">
      <Link className="btn btn-primary" href={href}>
        {label}
      </Link>
      {email && (
        <a className="btn btn-ghost-dk ic" href={`mailto:${email}`} aria-label={`Email ${email}`}>
          ✉
        </a>
      )}
    </div>
  );
}
