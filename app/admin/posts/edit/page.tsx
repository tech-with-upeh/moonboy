"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/posts";

const COVERS = ["botanical", "handwritten", "moonlight", "polaroid", "vinyl", "linen", "wildflower", "dusk"];
const input = "w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none";
const label = "mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft";

export default function EditPostPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState(""); const [slug, setSlug] = useState(""); const [excerpt, setExcerpt] = useState(""); const [content, setContent] = useState("");
  const [category, setCategory] = useState("musings"); const [cover, setCover] = useState("moonlight"); const [coverUrl, setCoverUrl] = useState(""); const [date, setDate] = useState(""); const [readTime, setReadTime] = useState("4"); const [favorite, setFavorite] = useState(false); const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false); const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/posts?id=${encodeURIComponent(id)}`).then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.error ?? "Unable to load post."); return data.post; }).then((p) => { setPost(p); setTitle(p.title); setSlug(p.slug); setExcerpt(p.excerpt); setContent(p.content); setCategory(p.category); setCover(p.cover ?? "moonlight"); setCoverUrl(p.coverUrl ?? ""); setDate(new Date(p.date).toISOString().slice(0, 10)); setReadTime(String(p.readTime)); setFavorite(p.favorite); setPublished(p.published); }).catch((e) => setError(e.message));
  }, [id]);

  async function uploadImage(file: File) { setUploading(true); setError(""); try { const form = new FormData(); form.append("file", file); const r = await fetch("/api/admin/images", { method: "POST", body: form }); const d = await r.json(); if (!r.ok) throw new Error(d.error ?? "Unable to upload image."); setCoverUrl(d.url); } catch (e) { setError(e instanceof Error ? e.message : "Unable to upload image."); } finally { setUploading(false); } }

  async function handleSubmit(e: FormEvent) { e.preventDefault(); if (!id) return; setSaving(true); setError(""); try { const r = await fetch("/api/admin/posts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "edit", title, slug, excerpt, content, category, cover: coverUrl ? null : cover, coverUrl: coverUrl || null, date, readTime: Number(readTime), favorite, published }) }); const d = await r.json(); if (!r.ok) throw new Error(d.error ?? "Unable to update post."); router.push("/admin/posts"); router.refresh(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to update post."); } finally { setSaving(false); } }

  if (!id) return <div className="px-6 py-10 font-body text-sm text-ink-soft">No post selected.</div>;
  if (!post && !error) return <section className="px-6 py-10 font-body text-sm text-ink-soft">Loading post…</section>;

  return <section className="min-h-screen px-6 py-8 md:px-10 lg:px-14"><div className="mx-auto max-w-4xl"><div className="flex items-end justify-between border-b border-line pb-6"><div><p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Posts</p><h1 className="mt-2 font-script text-4xl text-ink">Edit post</h1></div><Link href="/admin/posts" className="font-ui text-[11px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink">Cancel</Link></div>
    {error && <p role="alert" className="mt-6 font-body text-sm text-red-600">{error}</p>}
    {post && <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]"><div className="space-y-5"><div><label className={label} htmlFor="title">Title</label><input id="title" className={input} value={title} onChange={e => setTitle(e.target.value)} required /></div><div><label className={label} htmlFor="slug">Slug</label><input id="slug" className={input} value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))} required /></div><div><label className={label} htmlFor="excerpt">Excerpt</label><textarea id="excerpt" className={`${input} min-h-24 resize-y`} value={excerpt} onChange={e => setExcerpt(e.target.value)} required /></div><div><label className={label} htmlFor="content">Content</label><textarea id="content" className={`${input} min-h-[420px] resize-y leading-loose`} value={content} onChange={e => setContent(e.target.value)} required /></div></div><aside className="space-y-5"><div><label className={label}>Category</label><select className={input} value={category} onChange={e => setCategory(e.target.value)}>{CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}</select></div><div><label className={label}>Cover style</label><select className={input} value={cover} onChange={e => setCover(e.target.value)} disabled={!!coverUrl}>{COVERS.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div><label className={label}>Cover image</label><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="w-full font-body text-xs text-ink-soft" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />{uploading && <p className="mt-2 font-body text-xs text-ink-soft">Uploading…</p>}</div><div><label className={label}>Publish date</label><input type="date" className={input} value={date} onChange={e => setDate(e.target.value)} required /></div><div><label className={label}>Read time</label><input type="number" min="1" max="120" className={input} value={readTime} onChange={e => setReadTime(e.target.value)} required /></div><label className="flex items-center gap-3 font-ui text-sm text-ink"><input type="checkbox" checked={favorite} onChange={e => setFavorite(e.target.checked)} /> Featured favorite</label><label className="flex items-center gap-3 font-ui text-sm text-ink"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published</label></aside><div className="border-t border-line pt-6 lg:col-span-2"><button type="submit" disabled={saving || uploading} className="rounded-full bg-ink px-7 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-sky hover:opacity-90 disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></div></form>}
  </div></section>;
}
