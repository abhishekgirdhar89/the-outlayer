import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

// Download every post (live + trashed) as a JSON backup. Protected by the
// admin middleware (matcher covers /admin/*). Your off-database safety net.
export const dynamic = "force-dynamic";

export async function GET() {
  const s = getAdminClient();
  const { data, error } = await s.from("posts").select("*").order("published_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const date = new Date().toISOString().slice(0, 10);
  const body = JSON.stringify({ exported_at: new Date().toISOString(), count: data?.length ?? 0, posts: data ?? [] }, null, 2);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="outlayer-posts-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
