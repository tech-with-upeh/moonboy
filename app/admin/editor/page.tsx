"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";

const input = "w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none";

type Saved = { id: string; title: string; content: string; status: "DRAFT" | "SAVED"; createdAt: string; updatedAt: string };

export default function EditorPage() {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState<Saved[]>([]);
  const [activeId, setActiveId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "SAVED">("DRAFT");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(true);

  async function loadSaved() {
    const response = await fetch("/api/admin/editor");
    if (!response.ok) return;
    const data = await response.json();
    setSaved(data.contents ?? []);
  }
  useEffect(() => { void loadSaved(); }, []);

  async function save(nextStatus: "DRAFT" | "SAVED" = status) {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/editor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: activeId || undefined, title, content, status: nextStatus }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to save.");
      setActiveId(data.content.id); setStatus(nextStatus); setMessage(nextStatus === "DRAFT" ? "Draft saved." : "Content saved."); await loadSaved();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save."); }
    finally { setBusy(false); }
  }

  function newContent() { setActiveId(""); setTitle("Untitled"); setContent(""); setStatus("DRAFT"); setMessage("New document."); }
  function openContent(item: Saved) { setActiveId(item.id); setTitle(item.title); setContent(item.content); setStatus(item.status); setMessage("Loaded."); }

  async function removeContent(id: string) {
    if (!window.confirm("Delete this saved content?")) return;
    const response = await fetch(`/api/admin/editor?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) { if (id === activeId) newContent(); await loadSaved(); }
  }

  const wordCount = useMemo(() => content.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim().split(/\s+/).filter(Boolean).length, [content]);

  async function uploadImage(file: File): Promise<string | null> {
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/admin/images", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error ?? "Image upload failed."); return null; }
    return data.url;
  }

  return <section className="min-h-screen px-5 py-7 md:px-8 lg:px-10"><div className="mx-auto max-w-[1500px]">
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6"><div><p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Writing room</p><h1 className="mt-2 font-script text-4xl text-ink">Editor</h1><p className="mt-2 max-w-xl font-body text-sm text-ink-soft">Write, format, preview and keep reusable pieces of writing before they become posts.</p></div><div className="flex items-center gap-2"><button onClick={newContent} className="rounded-full border border-line px-4 py-2 font-ui text-[10px] font-semibold uppercase tracking-[0.1em] text-ink">New</button><Link href="/admin/posts/new" className="rounded-full bg-ink px-4 py-2 font-ui text-[10px] font-semibold uppercase tracking-[0.1em] text-sky">New post</Link></div></header>
    <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
      <div className="min-w-0"><div className="mb-3 flex items-center justify-between gap-3"><input className="border-0 bg-transparent px-0 font-script text-3xl text-ink outline-none placeholder:text-ink-soft" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Untitled"/><span className="font-ui text-[10px] text-ink-soft">{wordCount} words</span></div><RichTextEditor value={content} onChange={setContent} uploadImage={uploadImage}/><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="font-ui text-[10px] text-ink-soft">{message || (status === "DRAFT" ? "Draft" : "Saved")}</span><div className="flex gap-2"><button disabled={busy} onClick={()=>void save("DRAFT")} className="rounded-full border border-line px-4 py-2 font-ui text-[10px] font-semibold uppercase tracking-[0.1em] text-ink">{busy ? "Saving…" : "Save draft"}</button><button disabled={busy} onClick={()=>void save("SAVED")} className="rounded-full bg-ink px-4 py-2 font-ui text-[10px] font-semibold uppercase tracking-[0.1em] text-sky">Save content</button></div></div></div>
      {preview && <div className="min-w-0 rounded-xl border border-line bg-surface"><div className="flex items-center justify-between border-b border-line px-5 py-3"><span className="font-ui text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Live preview</span><span className="font-ui text-[9px] uppercase tracking-[0.1em] text-ink-soft">updates as you type</span></div><article className="prose prose-sm max-w-none px-7 py-7 font-body text-[16px] leading-loose text-ink" dangerouslySetInnerHTML={{ __html: content || "<p class='text-ink-soft'>Start writing to see your article here.</p>" }}/></div>}
      <aside className="space-y-5"><div className="flex items-center justify-between"><h2 className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">Saved writing</h2><button onClick={()=>setPreview(v=>!v)} className="font-ui text-[10px] text-ink-soft hover:text-ink">{preview ? "Hide preview" : "Show preview"}</button></div><div className="rounded-xl border border-line bg-surface p-3"><p className="mb-3 font-body text-xs text-ink-soft">Reusable drafts and finished snippets live here. Open one, continue writing, or send it to a post.</p><div className="space-y-2">{saved.length===0?<p className="py-5 text-center font-body text-xs text-ink-soft">Nothing saved yet.</p>:saved.map(item=><div key={item.id} className={`rounded-lg border p-3 ${item.id===activeId?"border-ink":"border-line"}`}><button onClick={()=>openContent(item)} className="w-full text-left"><div className="truncate font-ui text-xs font-semibold text-ink">{item.title}</div><div className="mt-1 font-ui text-[9px] uppercase tracking-[0.08em] text-ink-soft">{item.status.toLowerCase()} · {new Date(item.updatedAt).toLocaleDateString()}</div></button><div className="mt-2 flex gap-3"><Link href={`/admin/posts/new?contentId=${encodeURIComponent(item.id)}`} className="font-ui text-[9px] uppercase tracking-[0.08em] text-ink-soft hover:text-ink">Use in post</Link><button onClick={()=>void removeContent(item.id)} className="font-ui text-[9px] uppercase tracking-[0.08em] text-red-600">Delete</button></div></div>)}</div></div></aside>
    </div>
  </div></section>;
}
