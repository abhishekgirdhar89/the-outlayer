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
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
