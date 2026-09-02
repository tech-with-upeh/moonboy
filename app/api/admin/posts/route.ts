import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const session = verifyAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

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

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ error: "Title, slug, excerpt, content and category are required." }, { status: 400 });
    }
    if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid publication date." }, { status: 400 });
    if (readTime < 1 || readTime > 120) return NextResponse.json({ error: "Read time must be between 1 and 120 minutes." }, { status: 400 });

    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "A post with this slug already exists." }, { status: 409 });

    const post = await db.post.create({
      data: {
        slug, title, excerpt, content, category, cover, coverUrl,
        date, readTime, favorite, published,
      },
    });

    return NextResponse.json({ ok: true, post: { id: post.id, slug: post.slug } }, { status: 201 });
  } catch (error) {
    console.error("Create post failed", error);
    return NextResponse.json({ error: "Unable to create the post." }, { status: 500 });
  }
}
