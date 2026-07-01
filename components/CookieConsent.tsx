"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COOKIE = "cookie_consent";

function readConsent(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * GDPR-style cookie banner. Renders nothing until mounted (avoids hydration
 * mismatch) and hides once a choice is stored. On Accept it refreshes so the
 * server re-renders with analytics enabled; on Reject analytics never loads.
 */
export function CookieConsent({
  enabled,
  message,
}: {
  enabled: boolean;
  message: string;
}) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (enabled && !readConsent()) setVisible(true);
  }, [enabled]);

  if (!visible) return null;

  const decide = (choice: "accepted" | "rejected") => {
    document.cookie = `${COOKIE}=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setVisible(false);
    if (choice === "accepted") router.refresh(); // reloads server layout → analytics loads
  };

  return (
    <div className="cookie-bar" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="cookie-inner">
        <div className="cookie-copy">
          <p>
            {message} <Link href="/legal/cookie-policy">Cookie Policy</Link>.
          </p>
        </div>
        <div className="cookie-actions">
          <button type="button" className="btn btn-ghost-dk" onClick={() => decide("rejected")}>
            Decline
          </button>
          <button type="button" className="btn btn-primary" onClick={() => decide("accepted")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
