"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface AdminPost { id: string; slug: string; title: string; excerpt: string; category: string; cover?: string | null; coverUrl?: string | null; date: string; readTime: number; likes: number; commentCount: number; published: boolean; }

type Filter = "all" | "published" | "hidden";

function IconEdit() { return <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5"><path d="m12.8 4.2 3 3M4 16l.8-3.5L13.9 3.4a1.6 1.6 0 0 1 2.3 2.3l-9.1 9.1L4 16Z" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IconTrash() { return <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h12M8 3.5h4M7 6v9.5h6V6M9 9v4M11 9v4" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IconEye({ off = false }: { off?: boolean }) { return <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z" strokeLinecap="round" strokeLinejoin="round" />{!off && <circle cx="10" cy="10" r="1.8" />}{off && <path d="m4 4 12 12" strokeLinecap="round" />}</svg>; }

export default function AdminPosts({ initialPosts }: { initialPosts: AdminPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const filteredPosts = useMemo(() => filter === "all" ? posts : posts.filter((post) => filter === "published" ? post.published : !post.published), [filter, posts]);
  const counts = useMemo(() => ({ all: posts.length, published: posts.filter((p) => p.published).length, hidden: posts.filter((p) => !p.published).length }), [posts]);

  async function togglePublished(post: AdminPost) {
    setBusyId(post.id); setError("");
    try { const response = await fetch("/api/admin/posts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: post.id, action: post.published ? "hide" : "show" }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Unable to update post."); setPosts((current) => current.map((item) => item.id === post.id ? { ...item, published: data.post.published } : item)); router.refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to update post."); } finally { setBusyId(null); }
  }

  async function deletePost(post: AdminPost) {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setBusyId(post.id); setError("");
    try { const response = await fetch(`/api/admin/posts?id=${encodeURIComponent(post.id)}`, { method: "DELETE" }); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Unable to delete post."); setPosts((current) => current.filter((item) => item.id !== post.id)); router.refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to delete post."); } finally { setBusyId(null); }
  }

  return <>
    <div className="mt-7 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-1.5">{(["all", "published", "hidden"] as Filter[]).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-3.5 py-2 font-ui text-[10px] uppercase tracking-[0.1em] transition-colors ${filter === value ? "bg-ink text-sky" : "text-ink-soft hover:bg-night/5 hover:text-ink"}`}>{value === "all" ? "All posts" : value} <span className="ml-1 opacity-60">{counts[value]}</span></button>)}</div><div className="font-ui text-[11px] text-ink-soft">{filteredPosts.length} {filteredPosts.length === 1 ? "story" : "stories"}</div></div>
    {error && <div role="alert" className="mt-3 border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">{error}</div>}
    <div className="mt-3 overflow-hidden border border-line bg-surface">
      <div className="hidden border-b border-line bg-[#f8f8f6] px-5 py-3 md:grid md:grid-cols-[minmax(0,1fr)_150px_100px_110px_170px] md:items-center md:gap-4"><div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Story</div><div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Published</div><div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Read</div><div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Engagement</div><div className="text-right font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Actions</div></div>
      {filteredPosts.length === 0 ? <div className="px-6 py-16 text-center"><div className="font-script text-2xl text-ink">No {filter === "hidden" ? "hidden" : filter === "published" ? "published" : "matching"} posts.</div><p className="mt-2 font-body text-sm text-ink-soft">Try another filter or create a new story.</p></div> : <div>{filteredPosts.map((post) => { const busy = busyId === post.id; return <div key={post.id} className="group border-b border-line last:border-b-0"><div className="grid gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_150px_100px_110px_170px] md:items-center md:gap-4 md:px-5">
        <div className="min-w-0"><div className="flex min-w-0 items-start gap-4"><div className="hidden h-14 w-20 shrink-0 overflow-hidden bg-night/5 sm:block">{post.coverUrl || post.cover ? <img src={post.coverUrl || post.cover || ""} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /> : <div className="flex h-full w-full items-center justify-center font-script text-lg text-ink-soft/60">M</div>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-ui text-[9px] uppercase tracking-[0.12em] text-moon-deep">{post.category}</span><span className="h-1 w-1 rounded-full bg-ink-soft/40" /><span className={`font-ui text-[9px] uppercase tracking-[0.1em] ${post.published ? "text-ink-soft" : "text-amber-700"}`}>{post.published ? "Published" : "Hidden"}</span></div><Link href={`/${post.slug}`} className="mt-1 block truncate font-body text-[16px] font-medium leading-6 text-ink transition-colors hover:text-moon-deep">{post.title}</Link><p className="mt-1 line-clamp-1 max-w-2xl font-body text-[12px] leading-5 text-ink-soft">{post.excerpt}</p></div></div></div>
        <div className="flex items-center justify-between md:block"><span className="font-ui text-[10px] uppercase tracking-[0.1em] text-ink-soft md:hidden">Published</span><div className="font-ui text-[12px] text-ink">{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.date))}</div></div>
        <div className="flex items-center justify-between md:block"><span className="font-ui text-[10px] uppercase tracking-[0.1em] text-ink-soft md:hidden">Read time</span><div className="font-ui text-[12px] text-ink">{post.readTime} min</div></div>
        <div className="flex items-center gap-4 font-ui text-[11px] text-ink-soft"><span>♡ {post.likes}</span><span>◌ {post.commentCount}</span></div>
        <div className="flex items-center justify-between gap-2 md:justify-end"><Link href={`/admin/posts/edit?id=${post.id}`} aria-label={`Edit ${post.title}`} className="inline-flex h-9 items-center gap-1.5 border border-line px-3 font-ui text-[10px] uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-sky"><IconEdit /><span className="hidden lg:inline">Edit</span></Link><button type="button" onClick={() => togglePublished(post)} disabled={busy} aria-label={post.published ? `Hide ${post.title}` : `Show ${post.title}`} className="inline-flex h-9 items-center gap-1.5 border border-line px-3 font-ui text-[10px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:cursor-wait disabled:opacity-50"><IconEye off={post.published} /><span className="hidden lg:inline">{busy ? "…" : post.published ? "Hide" : "Show"}</span></button><button type="button" onClick={() => deletePost(post)} disabled={busy} aria-label={`Delete ${post.title}`} className="inline-flex h-9 items-center gap-1.5 border border-red-200 px-3 font-ui text-[10px] uppercase tracking-[0.08em] text-red-600 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"><IconTrash /><span className="hidden lg:inline">Delete</span></button></div>
      </div></div>; })}</div>}
    </div>
  </>;
}
