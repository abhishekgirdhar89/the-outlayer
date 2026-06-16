"use client";

import { useActionState } from "react";
import { Accent } from "./Accent";
import { subscribe, type FormState } from "@/app/form-actions";

const initial: FormState = { ok: false };

export function SubscribeForm({
  heading,
  body,
  cadence,
  source = "Homepage",
}: {
  heading: string;
  body: string;
  cadence?: string;
  source?: string;
}) {
  const [state, action, pending] = useActionState(subscribe, initial);
  const emailErr = state.fieldErrors?.email;

  return (
    <div className="sub-band reveal">
      <div className="sub-copy">
        <h2>
          <Accent text={heading} />
        </h2>
        <p>{body}</p>
      </div>
      <div className="sub-right">
        {state.ok ? (
          <div className="sub-done" style={{ display: "block" }}>
            You&apos;re in — first issue is on its way. ✓
          </div>
        ) : (
          <>
            <form className="sub-form" action={action} noValidate>
              <input type="hidden" name="source" value={source} />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <input name="email" type="email" placeholder="you@company.com" aria-label="Email" />
              <button className="btn btn-primary" type="submit" disabled={pending}>
                {pending ? "…" : "Subscribe"}
              </button>
            </form>
            {emailErr ? (
              <span className="field-err">{emailErr}</span>
            ) : state.error ? (
              <span className="field-err">{state.error}</span>
            ) : cadence ? (
              <span className="sub-cadence">{cadence}</span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
