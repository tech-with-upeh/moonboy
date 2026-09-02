import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";

function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function unauthorized() { return NextResponse.json({ error: "Unauthorized." }, { status: 401 }); }
function sessionOk() { return Boolean(verifyAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value)); }

export async function GET(request: Request) {
  if (!sessionOk()) return unauthorized();
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Post id is required." }, { status: 400 });
    const post = await db.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) { console.error("Get admin post failed", error); return NextResponse.json({ error: "Unable to load the post." }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!sessionOk()) return unauthorized();
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug = slugify(typeof body.slug === "string" && body.slug.trim() ? body.slug : title);
    const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const cover = typeof body.cover === "string" && body.cover ? body.cover : null;
    const coverUrl = typeof body.coverUrl === "string" && body.coverUrl ? body.coverUrl : null;
    const readTime = Number.isInteger(body.readTime) ? body.readTime : 1;
    const date = typeof body.date === "string" && body.date ? new Date(body.date) : new Date();
    const published = body.published !== false;
    const favorite = body.favorite === true;
    if (!title || !slug || !excerpt || !content || !category) return NextResponse.json({ error: "Title, slug, excerpt, content and category are required." }, { status: 400 });
    if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid publication date." }, { status: 400 });
    if (readTime < 1 || readTime > 120) return NextResponse.json({ error: "Read time must be between 1 and 120 minutes." }, { status: 400 });
    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "A post with this slug already exists." }, { status: 409 });
    const post = await db.post.create({ data: { slug, title, excerpt, content, category, cover, coverUrl, date, readTime, favorite, published } });
    return NextResponse.json({ ok: true, post: { id: post.id, slug: post.slug } }, { status: 201 });
  } catch (error) { console.error("Create post failed", error); return NextResponse.json({ error: "Unable to create the post." }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  if (!sessionOk()) return unauthorized();
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const action = body.action as "edit" | "hide" | "show" | undefined;
    if (!id) return NextResponse.json({ error: "Post id is required." }, { status: 400 });
    const post = await db.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    if (action === "hide" || action === "show") {
      const updated = await db.post.update({ where: { id }, data: { published: action === "show" } });
      return NextResponse.json({ ok: true, post: { id: updated.id, slug: updated.slug, published: updated.published } });
    }
    if (action !== "edit") return NextResponse.json({ error: "A valid action is required." }, { status: 400 });
    const title = typeof body.title === "string" ? body.title.trim() : post.title;
    const slug = slugify(typeof body.slug === "string" && body.slug.trim() ? body.slug : post.slug);
    const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : post.excerpt;
    const content = typeof body.content === "string" ? body.content.trim() : post.content;
    const category = typeof body.category === "string" ? body.category.trim() : post.category;
    const readTime = Number.isInteger(body.readTime) ? body.readTime : post.readTime;
    const date = typeof body.date === "string" && body.date ? new Date(body.date) : post.date;
    if (!title || !slug || !excerpt || !content || !category) return NextResponse.json({ error: "Title, slug, excerpt, content and category are required." }, { status: 400 });
    if (Number.isNaN(date.getTime()) || readTime < 1 || readTime > 120) return NextResponse.json({ error: "Invalid date or read time." }, { status: 400 });
    const duplicate = await db.post.findFirst({ where: { slug, NOT: { id } }, select: { id: true } });
    if (duplicate) return NextResponse.json({ error: "A post with this slug already exists." }, { status: 409 });
    const updated = await db.post.update({ where: { id }, data: { title, slug, excerpt, content, category, cover: typeof body.cover === "string" ? body.cover || null : post.cover, coverUrl: typeof body.coverUrl === "string" ? body.coverUrl || null : post.coverUrl, readTime, date, favorite: typeof body.favorite === "boolean" ? body.favorite : post.favorite, published: typeof body.published === "boolean" ? body.published : post.published } });
    return NextResponse.json({ ok: true, post: { id: updated.id, slug: updated.slug, published: updated.published } });
  } catch (error) { console.error("Update post failed", error); return NextResponse.json({ error: "Unable to update the post." }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  if (!sessionOk()) return unauthorized();
  try {
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!id) return NextResponse.json({ error: "Post id is required." }, { status: 400 });
    const post = await db.post.findUnique({ where: { id }, select: { id: true } });
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    await db.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("Delete post failed", error); return NextResponse.json({ error: "Unable to delete the post." }, { status: 500 }); }
}
