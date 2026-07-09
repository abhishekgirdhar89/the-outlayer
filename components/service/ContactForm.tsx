"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { submitEnquiry, type FormState } from "@/app/form-actions";
import { PRIMARY, REST, type Country } from "./country-codes";

const initial: FormState = { ok: false };

export type ServiceFormCopy = {
  contextLabel: string;
  contextHint: string;
  contextPlaceholder: string;
  note: string;
  ackHeading: string;
  ackBody: string;
};

function firstName(name?: string) {
  return (name ?? "").trim().split(/\s+/)[0] ?? "";
}
function personalise(template: string, name?: string) {
  const first = firstName(name);
  if (!template.includes("{name}")) return template;
  return first ? template.replace(/\{name\}/g, first) : template.replace(/,?\s*\{name\}/g, "");
}

export function ContactForm({
  source,
  capA,
  capB,
  copy,
  bookingUrl,
  contactEmail,
  idPrefix = "f",
}: {
  source: string;
  capA: number;
  capB: number;
  copy: ServiceFormCopy;
  bookingUrl: string;
  contactEmail: string;
  idPrefix?: string;
}) {
  const id = (k: string) => `${idPrefix}-${k}`;
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const fe = state.fieldErrors ?? {};

  // --- country picker state ---
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Country>(PRIMARY[0]);
  const [hi, setHi] = useState(0);
  const [phone, setPhone] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const match = (c: Country) => !q || c[0].toLowerCase().includes(q) || c[2].includes(q);
  const pri = useMemo(() => PRIMARY.filter(match), [q]);
  const rest = useMemo(() => REST.filter(match), [q]);
  const flat = useMemo(() => [...pri, ...rest], [pri, rest]);

  useEffect(() => setHi(0), [q, open]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  // focus the search when opened
  useEffect(() => {
    if (open) { const t = setTimeout(() => searchRef.current?.focus(), 40); return () => clearTimeout(t); }
  }, [open]);

  function choose(c: Country) {
    setSelected(c);
    setOpen(false);
    phoneRef.current?.focus();
  }

  function onSearchKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((i) => Math.min(i + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (flat[hi]) choose(flat[hi]); }
  }

  const isSent = state.ok;

  const bookingHref =
    bookingUrl && state.lead
      ? `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}name=${encodeURIComponent(
          state.lead.name
        )}&email=${encodeURIComponent(state.lead.email)}`
      : bookingUrl;

  let idx = 0; // running index across the flat list for arrow highlighting
  const renderItem = (c: Country) => {
    const i = idx++;
    return (
      <div
        key={c[3] + c[2]}
        role="option"
        aria-selected={selected[3] === c[3]}
        className={`cc-item${selected[3] === c[3] ? " sel" : ""}${hi === i ? " active" : ""}`}
        onMouseEnter={() => setHi(i)}
        onClick={() => choose(c)}
      >
        <span className="fl">{c[1]}</span>
        <span className="cn">{c[0]}</span>
        <span className="cd">{c[2]}</span>
      </div>
    );
  };

  return (
    <form className={`form-wrap cmo reveal r2 d2${isSent ? " on sent" : ""}`} action={action} noValidate>
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

      <div className="form-live">
        {state.error && <div className="form-err">{state.error}</div>}

        <div className="trio">
          <div className="field">
            <label htmlFor={id("name")}>Name<span className="req">*</span></label>
            <input type="text" id={id("name")} name="name" placeholder="Your name" autoComplete="name" />
            <div className="err">{fe.name || ""}</div>
          </div>
          <div className="field">
            <label htmlFor={id("email")}>Email<span className="req">*</span></label>
            <input type="email" id={id("email")} name="email" placeholder="you@company.com" autoComplete="email" />
            <div className="err">{fe.email || ""}</div>
          </div>
          <div className="field">
            <label htmlFor={id("phone")}>Phone<span className="req">*</span></label>
            <div className="phone-row">
              <div className="cc-wrap" ref={wrapRef}>
                <button
                  type="button"
                  className={`cc-btn${open ? " open" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  aria-label="Select country dial code"
                  onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); setQuery(""); }}
                >
                  <span className="cur"><span className="fl">{selected[1]}</span><span className="dl">{selected[2]}</span></span>
                  <span className="chv" aria-hidden="true" />
                </button>
                <div className={`cc-pop${open ? " open" : ""}`} role="dialog" aria-label="Country picker">
                  <div className="cc-search">
                    <input
                      ref={searchRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={onSearchKey}
                      placeholder="Search country or code"
                      autoComplete="off"
                    />
                  </div>
                  <div className="cc-list" role="listbox">
                    {!flat.length && <div className="cc-none">No match</div>}
                    {!!pri.length && <div className="cc-grouplabel">Primary markets</div>}
                    {pri.map(renderItem)}
                    {!!rest.length && <div className="cc-grouplabel">{q ? "Matches" : "All countries"}</div>}
                    {rest.map(renderItem)}
                  </div>
                </div>
              </div>
              <input
                ref={phoneRef}
                type="tel"
                id={id("phone")}
                placeholder="Phone number"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input type="hidden" name="phone" value={`${selected[2]} ${phone}`.trim()} />
            </div>
            <div className="err">{fe.phone || ""}</div>
          </div>
        </div>

        <div className="oneline field">
          <label htmlFor={id("ctx")}>
            {copy.contextLabel} {copy.contextHint && <span className="aside">{copy.contextHint}</span>}
          </label>
          <textarea id={id("ctx")} name="message" rows={3} placeholder={copy.contextPlaceholder} />
          <div className="err">{fe.message || ""}</div>
        </div>

        <div className="field cap-field">
          <label htmlFor={id("cap")}>Quick check, what is {capA} + {capB}?</label>
          <input id={id("cap")} name="cap_answer" type="text" inputMode="numeric" placeholder="Answer" autoComplete="off" />
          <input type="hidden" name="cap_a" value={capA} />
          <input type="hidden" name="cap_b" value={capB} />
          <div className="err">{fe.captcha || ""}</div>
        </div>
        <div className="send-row">
          <button type="submit" className="btn-send" disabled={pending}>
            {pending ? "Sending…" : <>Send it over <span aria-hidden="true">→</span></>}
          </button>
        </div>
        <p className="fnote">{copy.note}</p>
      </div>

      <div className="form-done" role="status" aria-live="polite">
        <div className="tick" aria-hidden="true">✓</div>
        <div>
          <h3>{personalise(copy.ackHeading, state.lead?.name)}</h3>
          {copy.ackBody && <p>{copy.ackBody}</p>}
          {(bookingHref || contactEmail) && (
            <div className="ack-actions">
              {bookingHref && (
                <a className="btn-send" href={bookingHref} target="_blank" rel="noopener">
                  Pick a time <span aria-hidden="true">→</span>
                </a>
              )}
              {contactEmail && (
                <span className="ack-alt">
                  Prefer email? <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
