import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage";

// Inline-image upload for the article editor. Protected by the admin middleware
// (matcher covers /admin/*). Accepts multipart with a `file`, stores it in the
// Supabase `media/posts` bucket, and returns the public URL.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
    }
    const url = await uploadImage(file, "posts");
    return NextResponse.json({ url });
  } catch (e) {
    console.error("inline image upload failed:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed." }, { status: 500 });
  }
}
