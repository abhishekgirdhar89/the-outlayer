/**
 * Transactional email for enquiry forms — a thin, provider-agnostic layer.
 *
 * Two transports, auto-selected by which env vars are set:
 *  1. GMAIL SMTP (preferred here) — sends FROM a Gmail address (e.g.
 *     think.outlayer@gmail.com) using that account's App Password.
 *       GMAIL_USER          – the Gmail address (also the From)
 *       GMAIL_APP_PASSWORD  – a 16-char Google App Password (needs 2FA on)
 *  2. RESEND (fallback) — Resend HTTP API from a verified domain.
 *       RESEND_API_KEY, EMAIL_FROM
 *
 * Fully OPTIONAL and non-blocking: with neither configured, every call is a
 * no-op that logs once, so leads are never lost and local dev needs no setup.
 * Optional override: EMAIL_FROM sets the display From (defaults to
 * "The Outlayer <GMAIL_USER>" under the Gmail transport).
 */

import nodemailer, { type Transporter } from "nodemailer";

export type LeadEmail = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
};

const BRAND = "The Outlayer";
const INK = "#0C1424";
const BLUE = "#3A6CF0";
const BONE = "#F4F1E9";

type Transport = "gmail" | "resend" | "none";

function transportKind(): Transport {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) return "gmail";
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) return "resend";
  return "none";
}

function isConfigured(): boolean {
  return transportKind() !== "none";
}

/** Display From — explicit EMAIL_FROM wins, else the Gmail account with a brand name. */
function fromAddress(): string {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  if (process.env.GMAIL_USER) return `${BRAND} <${process.env.GMAIL_USER}>`;
  return "";
}

// Reuse one SMTP connection pool across warm invocations.
let _smtp: Transporter | null = null;
function gmailTransport(): Transporter {
  if (!_smtp) {
    _smtp = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
  }
  return _smtp;
}

/** Low-level send. Returns a result object; never throws. */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const kind = transportKind();
  const from = fromAddress();
  if (kind === "none" || !from) {
    console.warn("[email] no transport configured — skipping send:", opts.subject);
    return { ok: false, skipped: true };
  }
  if (!opts.to) return { ok: false, skipped: true };
  try {
    if (kind === "gmail") {
      await gmailTransport().sendMail({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
      });
      return { ok: true };
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] send failed:", e);
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}

const esc = (s: string) =>
  (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function firstName(name: string) {
  return (name || "").trim().split(/\s+/)[0] || "there";
}

/** Shared email chrome: a centred card on an off-white canvas, brand bar on top. */
function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${BONE};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BONE};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #E5E1D6;border-radius:16px;overflow:hidden;">
        <tr><td style="background:${INK};padding:18px 28px;">
          <span style="display:inline-block;vertical-align:middle;width:10px;height:10px;border-radius:2px;background:${BLUE};margin-right:9px;"></span>
          <span style="font-size:15px;font-weight:700;letter-spacing:-0.02em;color:${BONE};vertical-align:middle;">${BRAND}</span>
        </td></tr>
        <tr><td style="padding:30px 28px 34px;">${inner}</td></tr>
        <tr><td style="padding:16px 28px 26px;border-top:1px solid #EDE9DE;">
          <p style="margin:0;font-size:11px;line-height:1.6;color:#8A8F98;">The non-obvious move. · Strategy that gets built.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function labelRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #EDE9DE;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8A8F98;width:110px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #EDE9DE;font-size:15px;color:${INK};vertical-align:top;">${value}</td>
  </tr>`;
}

/** Email to the practice owner announcing a new lead. */
export function renderOwnerEmail(lead: LeadEmail): { subject: string; html: string } {
  const subject = `New enquiry — ${lead.source} — ${lead.name || "Someone"}`;
  const msg = esc(lead.message).replace(/\n/g, "<br/>") || "<em style='color:#8A8F98;'>No message</em>";
  const inner = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${BLUE};">New enquiry</p>
    <h1 style="margin:0 0 20px;font-size:24px;line-height:1.15;letter-spacing:-0.02em;color:${INK};">${esc(lead.source)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${labelRow("Name", esc(lead.name))}
      ${labelRow("Email", `<a href="mailto:${esc(lead.email)}" style="color:${BLUE};text-decoration:none;">${esc(lead.email)}</a>`)}
      ${labelRow("Phone", esc(lead.phone) || "&mdash;")}
      ${labelRow("Interested in", esc(lead.source))}
      ${labelRow("Message", msg)}
    </table>
    <div style="margin-top:26px;">
      <a href="mailto:${esc(lead.email)}" style="display:inline-block;background:${BLUE};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:9px;">Reply to ${esc(firstName(lead.name))} &rarr;</a>
    </div>`;
  return { subject, html: shell(inner) };
}

export type AckCopy = { subject: string; heading: string; body: string; signoff: string };

/** Branded acknowledgement to the person who submitted the form. Copy is CMS-editable. */
export function renderAckEmail(
  lead: LeadEmail,
  opts: { bookingUrl?: string; replyEmail: string; copy: AckCopy; serviceLabel: string }
): { subject: string; html: string } {
  const fn = firstName(lead.name);
  const fill = (t: string) => (t || "").replace(/\{name\}/g, fn).replace(/\{service\}/g, opts.serviceLabel);
  const subject = fill(opts.copy.subject) || `Thanks, ${fn} — I've got your note`;
  const heading = fill(opts.copy.heading) || `Got it, ${fn} — it's with me.`;
  const body = fill(opts.copy.body);
  const signoff = opts.copy.signoff || "Abhishek Girdhar";
  const echo = lead.message
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 6px;">
         <tr><td style="border-left:2px solid ${BLUE};background:#FBFAF6;border-radius:8px;padding:14px 16px;">
           <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8A8F98;">What you sent</p>
           <p style="margin:0;font-size:14px;line-height:1.55;color:#565E6B;">${esc(lead.message).replace(/\n/g, "<br/>")}</p>
         </td></tr>
       </table>`
    : "";
  const booking = opts.bookingUrl
    ? `<div style="margin-top:24px;"><a href="${esc(opts.bookingUrl)}" style="display:inline-block;background:${BLUE};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:9px;">Pick a time to talk &rarr;</a></div>`
    : "";
  const inner = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${BLUE};">Received</p>
    <h1 style="margin:0 0 14px;font-size:26px;line-height:1.12;letter-spacing:-0.02em;color:${INK};">${esc(heading)}</h1>
    <p style="margin:0;font-size:16px;line-height:1.6;color:#565E6B;">${esc(body).replace(/\n/g, "<br/>")}</p>
    ${echo}
    ${booking}
    <p style="margin:26px 0 0;font-size:14px;line-height:1.6;color:#565E6B;">In the meantime, just reply to this email if you want to add anything, or reach me at <a href="mailto:${esc(opts.replyEmail)}" style="color:${BLUE};text-decoration:none;">${esc(opts.replyEmail)}</a>.</p>
    <p style="margin:22px 0 0;font-size:15px;color:${INK};">— ${esc(signoff)}<br/><span style="color:#8A8F98;font-size:13px;">${BRAND}</span></p>`;
  return { subject, html: shell(inner) };
}

/**
 * Fire both emails for a new lead. Non-blocking by design: the caller should
 * NOT await this in a way that can fail the lead insert. Returns nothing useful;
 * all errors are swallowed + logged inside sendEmail.
 */
export async function notifyNewLead(
  lead: LeadEmail,
  cfg: { notifyEmail: string; bookingUrl: string; publicReplyEmail: string; ackCopy: AckCopy; serviceLabel: string }
): Promise<void> {
  if (!isConfigured()) {
    console.warn("[email] email not configured — new lead recorded but no mail sent.");
    return;
  }
  const owner = renderOwnerEmail(lead);
  const ack = renderAckEmail(lead, {
    bookingUrl: cfg.bookingUrl,
    replyEmail: cfg.publicReplyEmail,
    copy: cfg.ackCopy,
    serviceLabel: cfg.serviceLabel,
  });
  await Promise.allSettled([
    cfg.notifyEmail
      ? sendEmail({ to: cfg.notifyEmail, subject: owner.subject, html: owner.html, replyTo: lead.email || undefined })
      : Promise.resolve(),
    lead.email ? sendEmail({ to: lead.email, subject: ack.subject, html: ack.html }) : Promise.resolve(),
  ]);
}
