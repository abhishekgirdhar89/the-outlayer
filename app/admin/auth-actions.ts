"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, expectedToken } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin") || "/admin";

  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    redirect("/admin/login?error=unconfigured");
  }
  if (password !== configured) {
    redirect("/admin/login?error=1");
  }

  const token = await expectedToken();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
