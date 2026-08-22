"use client";

import { useEffect, useState, type FormEvent } from "react";
import Avatar from "@/components/Avatar";
import type { Comment } from "@/lib/social";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function initialsFor(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Comments({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: Comment[];
}) {
  const storageKey = `moonboy:comments:${slug}`;

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setComments(JSON.parse(stored));
    } catch {
      // localStorage unavailable or corrupt — keep seed comments
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName || !trimmedBody) return;

    const next: Comment[] = [
      ...comments,
      {
        id: `local-${Date.now()}`,
        name: trimmedName,
        initials: initialsFor(trimmedName),
        date: new Date().toISOString(),
        body: trimmedBody,
      },
    ];
    setComments(next);
    setBody("");
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore persistence errors
    }
  }

  return (
    <div>
      <h2 className="font-script text-3xl text-ink">
        {comments.length === 0
          ? "Be the first to comment"
          : comments.length === 1
          ? "1 comment"
          : `${comments.length} comments`}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 font-body text-[14px] text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
        />
        <textarea
          required
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add to the discussion…"
          className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-2.5 font-body text-[14px] text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2.5 font-ui font-semibold text-[12px] uppercase tracking-[0.12em] text-sky transition-opacity hover:opacity-90"
        >
          Post comment
        </button>
      </form>

      {comments.length > 0 && (
        <ul className="mt-10 space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <Avatar name={comment.name} initials={comment.initials} size={32} />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-ui font-medium text-[13px] text-ink">
                    {comment.name}
                  </span>
                  <span className="font-ui font-medium text-[11px] text-ink-soft">
                    {formatDate(comment.date)}
                  </span>
                </div>
                <p className="mt-1 font-body text-[14px] leading-relaxed text-ink-soft">
                  {comment.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
