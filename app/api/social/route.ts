import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getVisitorId, VISITOR_COOKIE } from "@/lib/visitor";

type Action = "like" | "unlike" | "comment" | "view" | "read_start" | "read_complete";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_COMMENTS_PER_WINDOW = 3;

function eventType(action: Action) { return { like: "LIKE", unlike: "UNLIKE", comment: "COMMENT", view: "VIEW", read_start: "READ_START", read_complete: "READ_COMPLETE" }[action] as const; }
function setVisitorCookie(response: NextResponse, visitorId: string) { response.cookies.set(VISITOR_COOKIE, visitorId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 * 2, path: "/" }); }
function cleanText(value: string) { return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim(); }
function looksLikeSpam(name: string, body: string) { const text = `${name} ${body}`.toLowerCase(); const urls = text.match(/https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|xyz|top|click|shop)\b/g) ?? []; if (urls.length >= 3) return true; if (/(.)\1{9,}/.test(body)) return true; const words = body.split(/\s+/).filter(Boolean); return words.length >= 8 && new Set(words.map((word) => word.toLowerCase())).size <= 2; }

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim();
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });
  const post = await db.post.findFirst({ where: { slug, published: true }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  const visitorId = getVisitorId();
  const [likes, comments, liked] = await Promise.all([
    db.postLike.count({ where: { postId: post.id } }),
    db.comment.findMany({ where: { postId: post.id, status: "APPROVED" }, orderBy: { createdAt: "asc" } }),
    db.postLike.findUnique({ where: { postId_visitorId: { postId: post.id, visitorId } }, select: { id: true } }),
  ]);
  const response = NextResponse.json({ likes, liked: Boolean(liked), comments: comments.map((comment) => ({ id: comment.id, name: comment.name, initials: initialsFor(comment.name), date: comment.createdAt.toISOString(), body: comment.body })) });
  setVisitorCookie(response, visitorId);
  return response;
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; action?: Action; name?: string; comment?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const slug = body.slug?.trim(); const action = body.action;
  if (!slug || !action || !["like", "unlike", "comment", "view", "read_start", "read_complete"].includes(action)) return NextResponse.json({ error: "slug and a valid action are required" }, { status: 400 });
  const post = await db.post.findFirst({ where: { slug, published: true }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  const visitorId = getVisitorId();
  const referrer = request.headers.get("referer")?.slice(0, 500) || null;
  const userAgent = request.headers.get("user-agent") || "";
  const device = /mobile|android|iphone|ipad/i.test(userAgent) ? "mobile" : "desktop";
  const browser = /firefox/i.test(userAgent) ? "Firefox" : /edg/i.test(userAgent) ? "Edge" : /chrome/i.test(userAgent) ? "Chrome" : /safari/i.test(userAgent) ? "Safari" : "Other";

  if (action === "comment") {
    const name = cleanText(body.name ?? ""); const comment = cleanText(body.comment ?? "");
    if (!name || !comment) return NextResponse.json({ error: "name and comment are required" }, { status: 400 });
    if (name.length > 80 || comment.length > 2000) return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
    const since = new Date(Date.now() - WINDOW_MS);
    const recentComments = await db.comment.count({ where: { visitorId, createdAt: { gte: since } } });
    if (recentComments >= MAX_COMMENTS_PER_WINDOW) return NextResponse.json({ error: "You're posting comments too quickly. Please try again in a few minutes." }, { status: 429 });
    const previous = await db.comment.findFirst({ where: { visitorId, postId: post.id }, orderBy: { createdAt: "desc" }, select: { body: true } });
    if (previous?.body.toLowerCase() === comment.toLowerCase()) return NextResponse.json({ error: "You've already posted that comment." }, { status: 409 });
    const spam = looksLikeSpam(name, comment);
    await db.comment.create({ data: { postId: post.id, visitorId, name, body: comment, status: spam ? "PENDING" : "APPROVED" } });
    await db.postEvent.create({ data: { postId: post.id, visitorId, type: eventType(action), referrer, device, browser } });
    const response = NextResponse.json({ ok: true, moderated: spam });
    setVisitorCookie(response, visitorId);
    return response;
  }

  if (action === "like") await db.postLike.upsert({ where: { postId_visitorId: { postId: post.id, visitorId } }, update: {}, create: { postId: post.id, visitorId } });
  else if (action === "unlike") await db.postLike.deleteMany({ where: { postId: post.id, visitorId } });
  await db.postEvent.create({ data: { postId: post.id, visitorId, type: eventType(action), referrer, device, browser } });
  if (action === "view") await db.postView.create({ data: { postId: post.id, visitorId, referrer, device, browser } });
  const [likes, liked] = await Promise.all([db.postLike.count({ where: { postId: post.id } }), db.postLike.findUnique({ where: { postId_visitorId: { postId: post.id, visitorId } }, select: { id: true } })]);
  const response = NextResponse.json({ ok: true, likes, liked: Boolean(liked) });
  setVisitorCookie(response, visitorId);
  return response;
}

function initialsFor(name: string) { return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join(""); }
