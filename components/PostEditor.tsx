"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/posts";
import RichTextEditor from "@/components/RichTextEditor";

const COVERS = ["botanical", "handwritten", "moonlight", "polaroid", "vinyl", "linen", "wildflower", "dusk"];
const input = "w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none";
const label = "mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft";
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
type InitialPost = { id?: string; title: string; slug: string; excerpt: string; content: string; category: string; cover?: string | null; coverUrl?: string | null; date: string; readTime: number; favorite: boolean; published: boolean };

export default function PostEditor({ mode, initialPost, initialContent }: { mode: "new" | "edit"; initialPost?: InitialPost; initialContent?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title ?? ""); const [slug, setSlug] = useState(initialPost?.slug ?? ""); const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? ""); const [content, setContent] = useState(initialContent ?? initialPost?.content ?? "");
  const [category, setCategory] = useState(initialPost?.category ?? "musings"); const [cover, setCover] = useState(initialPost?.cover ?? "moonlight"); const [coverUrl, setCoverUrl] = useState(initialPost?.coverUrl ?? ""); const [date, setDate] = useState(initialPost?.date ? new Date(initialPost.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)); const [readTime, setReadTime] = useState(String(initialPost?.readTime ?? 4)); const [favorite, setFavorite] = useState(initialPost?.favorite ?? false); const [published, setPublished] = useState(initialPost?.published ?? true);
  const [slugEdited, setSlugEdited] = useState(mode === "edit"); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false); const [error, setError] = useState("");
  // The cover file the admin picked is held locally and only uploaded to B2
  // once the post is actually saved, so an abandoned edit never leaves an
  // orphaned image sitting in the bucket. coverPreview is a local object URL
  // used purely for on-screen preview and is never sent to the server.
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const generatedSlug = useMemo(() => slugify(title), [title]);
  // Strips HTML tags from the rich-text content, counts words, and estimates
  // reading time at 225 words/minute (a common average for web reading
  // speed), rounding up so short posts never show "0 min".
  function calculateReadTime() {
    const text = content.replace(/<[^>]*>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean);
    const minutes = Math.max(1, Math.ceil(words.length / 225));
    setReadTime(String(Math.min(120, minutes)));
  }
  async function uploadImage(file: File): Promise<string | null> { setUploading(true); setError(""); try { const form = new FormData(); form.append("file", file); const response = await fetch("/api/admin/images", { method: "POST", body: form }); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Unable to upload image."); return data.url; } catch (err) { setError(err instanceof Error ? err.message : "Unable to upload image."); return null; } finally { setUploading(false); } }
  function handleCoverFileSelect(file: File | null) {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    if (!file) { setPendingCoverFile(null); setCoverPreview(""); return; }
    setPendingCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      // Only upload the cover image now, at save time, instead of the moment
      // it was picked. If this fails, the post save is aborted before any
      // orphaned image reaches B2.
      let nextCoverUrl = coverUrl;
      if (pendingCoverFile) {
        const uploadedUrl = await uploadImage(pendingCoverFile);
        if (!uploadedUrl) { setSaving(false); return; }
        nextCoverUrl = uploadedUrl;
      }
      const payload = { title, slug: slugEdited ? slug : generatedSlug, excerpt, content, category, cover: nextCoverUrl ? null : cover, coverUrl: nextCoverUrl || null, date, readTime: Number(readTime), favorite, published };
      const response = await fetch("/api/admin/posts", { method: mode === "new" ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mode === "new" ? payload : { ...payload, id: initialPost?.id, action: "edit" }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? `Unable to ${mode === "new" ? "create" : "update"} post.`);
      setCoverUrl(nextCoverUrl);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setPendingCoverFile(null); setCoverPreview("");
      router.push("/admin/posts"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save post."); } finally { setSaving(false); }
  }
  return <section className="min-h-screen px-6 py-8 md:px-10 lg:px-14"><div className="mx-auto max-w-5xl"><div className="flex items-end justify-between border-b border-line pb-6"><div><p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Posts</p><h1 className="mt-2 font-script text-4xl text-ink">{mode === "new" ? "New post" : "Edit post"}</h1></div><Link href="/admin/posts" className="font-ui text-[11px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink">Cancel</Link></div>
    <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="space-y-5"><div><label className={label} htmlFor="title">Title</label><input id="title" className={input} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => !slugEdited && setSlug(generatedSlug)} required /></div><div><label className={label} htmlFor="slug">Slug</label><input id="slug" className={input} value={slugEdited ? slug : generatedSlug} onChange={(e) => { setSlugEdited(true); setSlug(slugify(e.target.value)); }} required /><p className="mt-1.5 font-body text-xs text-ink-soft">/{slugEdited ? slug : generatedSlug || "your-post-slug"}</p></div><div><label className={label} htmlFor="excerpt">Excerpt</label><textarea id="excerpt" className={`${input} min-h-24 resize-y`} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required /></div><div><label className={label}>Content</label><RichTextEditor value={content} onChange={setContent} uploadImage={uploadImage} /></div></div>
      <aside className="space-y-5"><div><label className={label} htmlFor="category">Category</label><select id="category" className={input} value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}</select></div><div><label className={label} htmlFor="cover">Cover style</label><select id="cover" className={input} value={cover ?? "moonlight"} onChange={(e) => setCover(e.target.value)} disabled={!!coverUrl || !!pendingCoverFile}>{COVERS.map((value) => <option key={value} value={value}>{value}</option>)}</select></div><div><label className={label} htmlFor="cover-image">Cover image</label><input id="cover-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="w-full font-body text-xs text-ink-soft" onChange={(e) => handleCoverFileSelect(e.target.files?.[0] ?? null)} />{(coverPreview || coverUrl) && <img src={coverPreview || coverUrl} alt="Cover preview" className="mt-2 h-24 w-full rounded-lg object-cover" />}{pendingCoverFile && <p className="mt-2 font-body text-xs text-ink-soft">Will upload on save.</p>}</div><div><label className={label} htmlFor="date">Publish date</label><input id="date" type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} required /></div><div><label className={label} htmlFor="read-time">Read time</label><div className="flex gap-2"><input id="read-time" type="number" min="1" max="120" className={input} value={readTime} onChange={(e) => setReadTime(e.target.value)} required /><button type="button" onClick={calculateReadTime} className="shrink-0 rounded-xl border border-line px-3 font-ui text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft hover:text-ink">Calculate</button></div></div><label className="flex items-center gap-3 font-ui text-sm text-ink"><input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} /> Featured favorite</label><label className="flex items-center gap-3 font-ui text-sm text-ink"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> {mode === "new" ? "Publish immediately" : "Published"}</label></aside>
      <div className="border-t border-line pt-6 lg:col-span-2">{error && <p role="alert" className="mb-4 font-body text-sm text-red-600">{error}</p>}<button type="submit" disabled={saving || uploading} className="rounded-full bg-ink px-7 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-sky transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving…" : mode === "new" ? published ? "Publish post" : "Save draft" : "Save changes"}</button></div>
    </form></div></section>;
}