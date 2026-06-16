// Server-only module: imported exclusively by Server Actions (uses the service-role key).
import { getAdminClient } from "./supabase";

const BUCKET = "media";

/** Upload a file to the public `media` bucket and return its public URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const admin = getAdminClient();
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "image/png",
    upsert: false,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Resolve an image field from a submitted form. Convention per field `base`:
 *   - `<base>`         hidden input holding the existing URL
 *   - `<base>__file`   optional newly-chosen file
 *   - `<base>__remove` optional checkbox to clear the image
 * Returns the URL to store.
 */
export async function resolveImage(formData: FormData, base: string, folder: string): Promise<string> {
  const file = formData.get(`${base}__file`);
  const existing = String(formData.get(base) ?? "").trim();
  const remove = formData.get(`${base}__remove`) === "on";

  if (file instanceof File && file.size > 0) return uploadImage(file, folder);
  if (remove) return "";
  return existing;
}
