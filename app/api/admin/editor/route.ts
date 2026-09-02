import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";

function getAdminId() {
  const session = verifyAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  return session?.adminId ?? null;
}

export async function GET(request: Request) {
  const adminId = getAdminId();
  if (!adminId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  const contents = id
    ? await db.savedContent.findFirst({ where: { id, adminId } })
    : await db.savedContent.findMany({ where: { adminId }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ contents });
}

export async function POST(request: Request) {
  const adminId = getAdminId();
  if (!adminId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const title = typeof body.title === "string" && body.title.trim() ? body.title.trim().slice(0, 160) : "Untitled";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const status = body.status === "SAVED" ? "SAVED" : "DRAFT";
    if (!content || content === "<p></p>") return NextResponse.json({ error: "There is no content to save." }, { status: 400 });
    const saved = id
      ? await db.savedContent.updateMany({ where: { id, adminId }, data: { title, content, status } })
      : null;
    if (id && !saved?.count) return NextResponse.json({ error: "Saved content not found." }, { status: 404 });
    const result = id
      ? await db.savedContent.findFirst({ where: { id, adminId } })
      : await db.savedContent.create({ data: { adminId, title, content, status } });
    return NextResponse.json({ ok: true, content: result });
  } catch (error) {
    console.error("Save editor content failed", error);
    return NextResponse.json({ error: "Unable to save content." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const adminId = getAdminId();
  if (!adminId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Content id is required." }, { status: 400 });
  const deleted = await db.savedContent.deleteMany({ where: { id, adminId } });
  if (!deleted.count) return NextResponse.json({ error: "Saved content not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
