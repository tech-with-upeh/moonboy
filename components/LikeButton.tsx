"use client";

import { useEffect, useState } from "react";

function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4c2.1-.3 4 .8 6.5 3 2.5-2.2 4.4-3.3 6.5-3 3.5.5 5 4 3.5 7.2-2.5 4.7-10 9.3-10 9.3Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function LikeButton({ slug, initialLikes, size = "md" }: { slug: string; initialLikes: number; size?: "sm" | "md" }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/social?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) { setLiked(data.liked); setCount(data.likes); } })
      .catch(() => {});
  }, [slug]);

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (busy) return;
    const next = !liked;
    setLiked(next); setCount((value) => Math.max(0, value + (next ? 1 : -1))); setBusy(true);
    try {
      const response = await fetch("/api/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, action: next ? "like" : "unlike" }) });
      if (!response.ok) throw new Error("Like failed");
      const data = await response.json(); setLiked(data.liked); setCount(data.likes);
    } catch { setLiked(!next); setCount((value) => Math.max(0, value + (next ? -1 : 1))); }
    finally { setBusy(false); }
  }

  const iconSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-[13px]" : "text-[14px]";
  return <button type="button" onClick={toggleLike} disabled={busy} aria-pressed={liked} aria-label={liked ? "Unlike this post" : "Like this post"} className={`flex items-center gap-2 font-ui font-medium ${textSize} text-ink-soft transition-colors disabled:opacity-60`}><span className={`flex ${iconSize} items-center justify-center rounded-full text-ink transition-colors ${liked ? "bg-ink text-sky" : "hover:text-ink"}`}><IconHeart filled={liked} /></span><span>{count}</span></button>;
}
