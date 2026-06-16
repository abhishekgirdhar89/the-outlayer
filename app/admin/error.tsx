"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tooBig = /body exceeded|1 ?mb|413/i.test(error.message);
  return (
    <div className="admin">
      <div className="login-wrap">
        <div className="login-card">
          <h1>Couldn&apos;t save that</h1>
          <div className="flash err" style={{ marginBottom: 16 }}>
            {tooBig
              ? "That upload was too large. Please choose an image under 5MB and try again."
              : error.message || "Something went wrong. Your change wasn't saved."}
          </div>
          <p style={{ marginBottom: 20 }}>
            Nothing was lost — you can try again or head back to the dashboard.
          </p>
          <div className="admin-actions">
            <button className="btn btn-primary" onClick={reset}>
              Try again
            </button>
            <Link className="btn btn-ghost-dk" href="/admin">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
