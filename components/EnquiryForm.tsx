"use client";

import { useActionState } from "react";
import { submitEnquiry, type FormState } from "@/app/form-actions";

const initial: FormState = { ok: false };

export type AckCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  echoLabel: string;
  ctaLabel: string;
  ctaHref: string;
  contactEmail: string;
};

/** Replace {name} in the heading template with the sender's first name (or drop it cleanly). */
function personalise(template: string, name?: string): string {
  const first = (name ?? "").trim().split(/\s+/)[0] ?? "";
  if (!template.includes("{name}")) return template;
  return first ? template.replace(/\{name\}/g, first) : template.replace(/,?\s*\{name\}/g, "");
}

export function EnquiryForm({
  source = "Homepage",
  capA,
  capB,
  ack,
}: {
  source?: string;
  capA: number;
  capB: number;
  ack: AckCopy;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const a = capA;
  const b = capB;
  const fe = state.fieldErrors ?? {};
  const lead = state.lead;

  // Booking link, with the sender's details pre-filled (Calendly-style query params).
  const bookingHref =
    ack.ctaHref && lead
      ? `${ack.ctaHref}${ack.ctaHref.includes("?") ? "&" : "?"}name=${encodeURIComponent(
          lead.name
        )}&email=${encodeURIComponent(lead.email)}`
      : ack.ctaHref;

  // Keep ONE persistent form node and toggle .sent — so the acknowledgement is never a
  // freshly-mounted .reveal element (which the scroll observer would leave invisible).
  // Force `in` on success so the form stays visible even as React rewrites className.
  return (
    <form
      className={`form reveal${state.ok ? " in sent" : ""}`}
      data-d="1"
      action={action}
      noValidate
    >
      <input type="hidden" name="source" value={source} />
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="form-fields">
        {state.error && <div className="form-err">{state.error}</div>}

        <div className="field">
          <label htmlFor="enq-name">Name</label>
          <input id="enq-name" name="name" type="text" placeholder="Your name" />
          {fe.name && <span className="field-err">{fe.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="enq-email">Email</label>
          <input id="enq-email" name="email" type="email" placeholder="you@company.com" />
          {fe.email && <span className="field-err">{fe.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="enq-phone">Phone</label>
          <input id="enq-phone" name="phone" type="tel" placeholder="+91 98765 43210" />
          {fe.phone && <span className="field-err">{fe.phone}</span>}
        </div>
        <div className="field">
          <label htmlFor="enq-need">What do you need?</label>
          <textarea id="enq-need" name="message" rows={2} placeholder="One line on what you're trying to move." />
          {fe.message && <span className="field-err">{fe.message}</span>}
        </div>
        <div className="field">
          <label htmlFor="enq-cap">Quick check: what is {a} + {b}?</label>
          <input id="enq-cap" name="cap_answer" type="text" inputMode="numeric" placeholder="Answer" autoComplete="off" />
          <input type="hidden" name="cap_a" value={a} />
          <input type="hidden" name="cap_b" value={b} />
          {fe.captcha && <span className="field-err">{fe.captcha}</span>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : <>Send enquiry <span className="arr">→</span></>}
        </button>
        <p className="fineprint">I read every message personally.</p>
      </div>

      <div className="form-done" role="status" aria-live="polite">
        <div className="tick">✓</div>
        {ack.eyebrow && <span className="ack-eyebrow">{ack.eyebrow}</span>}
        <h3>{personalise(ack.heading, lead?.name)}</h3>
        {ack.body && <p>{ack.body}</p>}
        {lead?.message && (
          <div className="ack-echo">
            {ack.echoLabel && <div className="lbl">{ack.echoLabel}</div>}
            <div className="val">&ldquo;{lead.message}&rdquo;</div>
          </div>
        )}
        {(bookingHref || ack.contactEmail) && (
          <div className="ack-actions">
            {bookingHref && (
              <a className="btn btn-primary" href={bookingHref} target="_blank" rel="noopener">
                {ack.ctaLabel || "Pick a time"} <span className="arr">→</span>
              </a>
            )}
            {ack.contactEmail && (
              <span className="ack-alt">
                Prefer email? <a href={`mailto:${ack.contactEmail}`}>{ack.contactEmail}</a>
              </span>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
