"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/posts";

const COVERS = ["botanical", "handwritten", "moonlight", "polaroid", "vinyl", "linen", "wildflower", "dusk"];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("musings");
  const [cover, setCover] = useState("moonlight");
  const [coverUrl, setCoverUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [readTime, setReadTime] = useState("4");
  const [favorite, setFavorite] = useState(false);
  const [published, setPublished] = useState(true);
  const [slugEdited, setSlugEdited] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generatedSlug = useMemo(() => slugify(title), [title]);

  async function uploadImage(file: File) {
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/images", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to upload image.");
      setCoverUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slugEdited ? slug : generatedSlug,
          excerpt,
          content,
          category,
          cover: coverUrl ? null : cover,
          coverUrl: coverUrl || null,
          date,
          readTime: Number(readTime),
          favorite,
          published,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to create post.");
      router.push(`/admin/posts`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create post.");
    } finally {
      setSaving(false);
    }
  }

  const input = "w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none";
  const label = "mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft";

  return (
    <section className="min-h-screen px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between border-b border-line pb-6">
          <div><p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Posts</p><h1 className="mt-2 font-script text-4xl text-ink">New post</h1></div>
          <Link href="/admin/posts" className="font-ui text-[11px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink">Cancel</Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <div><label className={label} htmlFor="title">Title</label><input id="title" className={input} value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => !slugEdited && setSlug(generatedSlug)} required /></div>
            <div><label className={label} htmlFor="slug">Slug</label><input id="slug" className={input} value={slugEdited ? slug : generatedSlug} onChange={(e) => { setSlugEdited(true); setSlug(slugify(e.target.value)); }} required /><p className="mt-1.5 font-body text-xs text-ink-soft">/{slugEdited ? slug : generatedSlug || "your-post-slug"}</p></div>
            <div><label className={label} htmlFor="excerpt">Excerpt</label><textarea id="excerpt" className={`${input} min-h-24 resize-y`} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required /></div>
            <div><label className={label} htmlFor="content">Content</label><textarea id="content" className={`${input} min-h-[420px] resize-y leading-loose`} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post here. Separate paragraphs with a blank line." required /></div>
          </div>

          <aside className="space-y-5">
            <div><label className={label} htmlFor="category">Category</label><select id="category" className={input} value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}</select></div>
            <div><label className={label} htmlFor="cover">Cover style</label><select id="cover" className={input} value={cover} onChange={(e) => setCover(e.target.value)} disabled={!!coverUrl}>{COVERS.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
            <div><label className={label} htmlFor="image">Cover image</label><input id="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="w-full font-body text-xs text-ink-soft" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />{uploading && <p className="mt-2 font-body text-xs text-ink-soft">Uploading…</p>}{coverUrl && <p className="mt-2 break-all font-body text-xs text-ink-soft">Uploaded and ready.</p>}</div>
            <div><label className={label} htmlFor="date">Publish date</label><input id="date" type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} required /></div>
            <div><label className={label} htmlFor="read-time">Read time</label><input id="read-time" type="number" min="1" max="120" className={input} value={readTime} onChange={(e) => setReadTime(e.target.value)} required /></div>
            <label className="flex items-center gap-3 font-ui text-sm text-ink"><input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} /> Featured favorite</label>
            <label className="flex items-center gap-3 font-ui text-sm text-ink"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publish immediately</label>
          </aside>

          <div className="lg:col-span-2 border-t border-line pt-6">
            {error && <p role="alert" className="mb-4 font-body text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={saving || uploading} className="rounded-full bg-ink px-7 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-sky transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving…" : published ? "Publish post" : "Save draft"}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
