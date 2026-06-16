import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, expectedToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page must stay reachable.
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const expected = await expectedToken();

  if (expected && token === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
