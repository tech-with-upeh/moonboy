import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionMaxAge,
  createAdminSession,
  getAdminCredentials,
} from "@/lib/auth";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const admin = getAdminCredentials();
    if (!safeEqual(email.trim().toLowerCase(), admin.email.trim().toLowerCase()) || !safeEqual(password, admin.password)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: createAdminSession(admin.email),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: adminSessionMaxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in. Check the server configuration." }, { status: 500 });
  }
}
