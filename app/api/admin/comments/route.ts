import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(request: Request) {
  const session = verifyAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const status = body.status;
    if (!id || !["APPROVED", "PENDING", "REJECTED"].includes(status)) return NextResponse.json({ error: "Invalid comment or status." }, { status: 400 });
    const comment = await db.comment.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true, id: comment.id, status: comment.status });
  } catch (error) {
    console.error("Moderate comment failed", error);
    return NextResponse.json({ error: "Unable to update comment." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = verifyAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Comment id is required." }, { status: 400 });
    await db.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete comment failed", error);
    return NextResponse.json({ error: "Unable to delete comment." }, { status: 500 });
  }
}
