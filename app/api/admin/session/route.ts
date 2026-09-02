import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = verifyAdminSession(
      cookies().get(ADMIN_SESSION_COOKIE)?.value,
    );

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const admin = await db.admin.findUnique({
      where: { id: session.adminId },
      select: { id: true },
    });

    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Admin session check failed", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
