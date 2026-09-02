"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default function EditPostPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/posts?id=${encodeURIComponent(id)}`)
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Unable to load post."); return data.post; })
      .then(setPost)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load post."));
  }, [id]);

  if (!id) return <div className="px-6 py-10 font-body text-sm text-ink-soft">No post selected.</div>;
  if (error) return <div className="px-6 py-10 font-body text-sm text-red-600">{error}</div>;
  if (!post) return <div className="px-6 py-10 font-body text-sm text-ink-soft">Loading post…</div>;
  return <PostEditor mode="edit" initialPost={post} />;
}
