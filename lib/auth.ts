export const SESSION_COOKIE = "outlayer_session";

/** Edge-safe SHA-256 → hex. */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * The session-cookie value we expect for an authenticated admin. Derived from
 * ADMIN_PASSWORD so the raw password is never stored in the cookie. Returns
 * null when no password is configured.
 */
export async function expectedToken(): Promise<string | null> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256Hex(`outlayer-session:${pw}`);
}
