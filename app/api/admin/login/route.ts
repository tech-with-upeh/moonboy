import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionMaxAge,
  createAdminSession,
} from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: createAdminSession(admin.id),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: adminSessionMaxAge,
    });

    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json(
      { error: "Unable to sign in. Check the server configuration." },
      { status: 500 },
    );
  }
}
