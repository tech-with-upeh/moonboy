import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = verifyAdminSession(
      cookies().get(ADMIN_SESSION_COOKIE)?.value,
    );

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = body?.currentPassword;
    const newPassword = body?.newPassword;
    const confirmPassword = body?.confirmPassword;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { error: "All password fields are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Your new password must be at least 8 characters." },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "The new passwords do not match." },
        { status: 400 },
      );
    }

    const admin = await db.admin.findUnique({
      where: { id: session.adminId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const validCurrentPassword = await bcrypt.compare(
      currentPassword,
      admin.passwordHash,
    );

    if (!validCurrentPassword) {
      return NextResponse.json(
        { error: "Your current password is incorrect." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.admin.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password update failed", error);
    return NextResponse.json(
      { error: "Unable to update your password." },
      { status: 500 },
    );
  }
}
