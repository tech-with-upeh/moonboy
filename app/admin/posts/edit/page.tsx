"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default function EditPostPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const contentId = params.get("contentId");
  const [post, setPost] = useState<any>(null);
  const [savedContent, setSavedContent] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/admin/posts?id=${encodeURIComponent(id)}`).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error ?? "Unable to load post."); return d.post; }),
      contentId ? fetch(`/api/admin/editor?id=${encodeURIComponent(contentId)}`).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error ?? "Unable to load saved content."); return d.contents; }) : Promise.resolve(null),
    ]).then(([loadedPost, saved]) => { setPost(loadedPost); if (saved) setSavedContent(saved.content); }).catch(err => setError(err instanceof Error ? err.message : "Unable to load post."));
  }, [id, contentId]);

  if (!id) return <div className="px-6 py-10 font-body text-sm text-ink-soft">No post selected.</div>;
  if (error) return <div className="px-6 py-10 font-body text-sm text-red-600">{error}</div>;
  if (!post) return <div className="px-6 py-10 font-body text-sm text-ink-soft">Loading post…</div>;
  return <PostEditor mode="edit" initialPost={post} initialContent={savedContent} />;
}
