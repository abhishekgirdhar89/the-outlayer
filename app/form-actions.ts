"use server";

import { getAdminClient } from "@/lib/supabase";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+]?[\d\s().-]{7,20}$/;

export type FormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back on success so the acknowledgement screen can personalise. */
  lead?: { name: string; email: string; message: string };
};

/** Contact / enquiry form → leads table. Includes email+phone validation,
 *  a honeypot, and a simple math CAPTCHA. */
export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source = String(formData.get("source") ?? "Homepage").trim() || "Homepage";

  // honeypot — bots fill this hidden field; pretend success without storing.
  if (String(formData.get("website") ?? "").trim()) return { ok: true };

  const capA = parseInt(String(formData.get("cap_a") ?? ""), 10);
  const capB = parseInt(String(formData.get("cap_b") ?? ""), 10);
  const capAns = parseInt(String(formData.get("cap_answer") ?? ""), 10);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please enter your name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (phone && !PHONE.test(phone)) fieldErrors.phone = "Enter a valid phone number.";
  if (!message) fieldErrors.message = "Tell me what you need in a line.";
  if (!Number.isFinite(capA) || !Number.isFinite(capAns) || capA + capB !== capAns)
    fieldErrors.captcha = "That sum isn't right — please try again.";

  if (Object.keys(fieldErrors).length)
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };

  try {
    const supabase = getAdminClient();
    const { error } = await supabase
      .from("leads")
      .insert({ name, email, phone, message, source, status: "New" });
    if (error) throw error;
  } catch (e) {
    console.error("submitEnquiry failed:", e);
    return { ok: false, error: "Something went wrong saving your enquiry. Please try again." };
  }
  return { ok: true, lead: { name, email, message } };
}

/** Newsletter subscribe → subscribers table, with email validation + dedupe. */
export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (String(formData.get("website") ?? "").trim()) return { ok: true }; // honeypot

  if (!EMAIL.test(email)) return { ok: false, fieldErrors: { email: "Enter a valid email address." } };

  try {
    const supabase = getAdminClient();
    const source = String(formData.get("source") ?? "Website").trim() || "Website";
    const { error } = await supabase
      .from("subscribers")
      .insert({ email, status: "Active", source });
    // 23505 = unique violation → already subscribed, treat as success
    if (error && error.code !== "23505") throw error;
  } catch (e) {
    console.error("subscribe failed:", e);
    return { ok: false, error: "Could not subscribe right now. Please try again." };
  }
  return { ok: true };
}
