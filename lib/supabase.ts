import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public, read-only client (anonymous key). Safe for server components that
 * only read published content. Subject to row-level-security policies.
 */
export function getPublicClient() {
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Guard against a common misconfiguration: pasting the anon (publishable) key
 * into SUPABASE_SERVICE_ROLE_KEY. That key passes the "is it set?" check but is
 * NOT privileged — so every admin write is silently blocked by row-level
 * security (0 rows affected, no error), which looks like "Save/Delete does
 * nothing". We detect it here and fail loudly with an actionable message.
 *
 * Returns an error string if the key is clearly not a service-role key, else null.
 */
function notAServiceKey(key: string): string | null {
  // New-style keys are self-describing by prefix.
  if (key.startsWith("sb_publishable_")) {
    return "it is a publishable (anon) key, not the service_role secret";
  }
  if (key.startsWith("sb_secret_")) return null; // new-style service key — fine

  // Legacy keys are JWTs: header.payload.signature, role lives in the payload.
  const parts = key.split(".");
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(
        Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
      );
      if (payload?.role && payload.role !== "service_role") {
        return `it is a "${payload.role}" key, not the service_role secret`;
      }
    } catch {
      // Couldn't decode — don't block; let the request proceed.
    }
  }
  return null;
}

/**
 * Privileged client (service-role key). SERVER-ONLY — never import into a
 * client component. Bypasses RLS so the admin panel can read drafts and write.
 */
export function getAdminClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local — required for the admin panel. " +
        "Get it from Supabase → Project Settings → API → service_role."
    );
  }
  const wrong = notAServiceKey(serviceKey);
  if (wrong) {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY looks wrong: ${wrong}. Admin writes (save/delete) would be ` +
        "silently rejected by row-level security. Set it to the service_role secret from " +
        "Supabase → Project Settings → API, then redeploy."
    );
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
