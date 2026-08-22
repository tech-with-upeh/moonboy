"use client";

import { useEffect, useState } from "react";

function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4c2.1-.3 4 .8 6.5 3 2.5-2.2 4.4-3.3 6.5-3 3.5.5 5 4 3.5 7.2-2.5 4.7-10 9.3-10 9.3Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function LikeButton({
  slug,
  initialLikes,
  size = "md",
}: {
  slug: string;
  initialLikes: number;
  size?: "sm" | "md";
}) {
  const likedKey = `moonboy:liked:${slug}`;
  const countKey = `moonboy:likeCount:${slug}`;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedLiked = window.localStorage.getItem(likedKey) === "1";
      const storedCount = window.localStorage.getItem(countKey);
      setLiked(storedLiked);
      setCount(storedCount !== null ? Number(storedCount) : initialLikes);
    } catch {}
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function toggleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !liked;
    const nextCount = next ? count + 1 : Math.max(0, count - 1);
    setLiked(next);
    setCount(nextCount);
    try {
      window.localStorage.setItem(likedKey, next ? "1" : "0");
      window.localStorage.setItem(countKey, String(nextCount));
    } catch {}
  }

  const iconSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-[13px]" : "text-[14px]";

  return (
    <button type="button" onClick={toggleLike} aria-pressed={liked} aria-label={liked ? "Unlike this post" : "Like this post"} className={`flex items-center gap-2 font-ui font-medium ${textSize} text-ink-soft transition-colors`}>
      <span className={`flex ${iconSize} items-center justify-center rounded-full text-ink transition-colors ${hydrated && liked ? "bg-ink text-sky" : "hover:text-ink"}`}>
        <IconHeart filled={hydrated && liked} />
      </span>
      <span>{count}</span>
    </button>
  );
}
