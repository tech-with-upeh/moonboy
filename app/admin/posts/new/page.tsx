"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default function NewPostPage() {
  const params = useSearchParams();
  const contentId = params.get("contentId");
  const [content, setContent] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(Boolean(contentId));

  useEffect(() => {
    if (!contentId) { setLoading(false); return; }
    fetch(`/api/admin/editor?id=${encodeURIComponent(contentId)}`)
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Unable to load saved content."); return data.contents; })
      .then(item => setContent(item?.content ?? ""))
      .catch(() => setContent(""))
      .finally(() => setLoading(false));
  }, [contentId]);

  if (loading) return <div className="px-6 py-10 font-body text-sm text-ink-soft">Loading saved content…</div>;
  return <PostEditor mode="new" initialContent={content} />;
}
