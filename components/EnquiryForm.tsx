"use client";

import { useActionState } from "react";
import { submitEnquiry, type FormState } from "@/app/form-actions";

const initial: FormState = { ok: false };

export function EnquiryForm({
  source = "Homepage",
  capA,
  capB,
}: {
  source?: string;
  capA: number;
  capB: number;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const a = capA;
  const b = capB;
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div className="form reveal" data-d="1">
        <div className="form-done">
          <div className="tick">✓</div>
          <h3>Got it — thank you.</h3>
          <p>Your enquiry is in. I&apos;ll be in touch shortly to find a time.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="form reveal" data-d="1" action={action} noValidate>
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
    </form>
  );
}
