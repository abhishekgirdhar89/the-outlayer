"use client";

import { useState } from "react";
import { ContactForm, type ServiceFormCopy } from "./ContactForm";

/**
 * Closing CTA: a centered heading + button that expands a second enquiry form
 * IN PLACE (grid-rows height transition, no modal, no page jump), then focuses
 * the first field. Reuses ContactForm (idPrefix="g") so validation + the
 * country picker are shared with the middle form.
 */
export function ClosingCta({
  tag,
  head,
  sub,
  button,
  source,
  capA,
  capB,
  copy,
  bookingUrl,
  contactEmail,
}: {
  tag: string;
  head: string;
  sub: string;
  button: string;
  source: string;
  capA: number;
  capB: number;
  copy: ServiceFormCopy;
  bookingUrl: string;
  contactEmail: string;
}) {
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => document.getElementById("g-name")?.focus(), reduce ? 0 : 460);
  };

  return (
    <div className="cta-wrap reveal r2">
      {tag && <p className="b-tag cta-tag">{tag}</p>}
      <h2 className="b-head cta-head">{head}</h2>
      {sub && <p className="cta-sub">{sub}</p>}
      <div className={`cta-expand${open ? " open" : ""}`}>
        <button type="button" className="btn-send cta-btn" onClick={onOpen} aria-expanded={open}>
          {button} <span aria-hidden="true">→</span>
        </button>
        <div className="cta-panel">
          <div className="cta-panel-inner">
            <ContactForm
              idPrefix="g"
              source={source}
              capA={capA}
              capB={capB}
              copy={copy}
              bookingUrl={bookingUrl}
              contactEmail={contactEmail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
