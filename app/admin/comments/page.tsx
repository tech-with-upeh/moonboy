import Link from "next/link";
import Avatar from "@/components/Avatar";
import { getAllComments } from "@/lib/admin";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function AdminComments() {
  const comments = getAllComments();

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-script text-2xl text-ink">Comments</h1>
      <p className="mt-1 font-body text-[14px] text-ink-soft">
        {comments.length} comments across all posts.
      </p>

      <div className="mt-8 border border-line bg-surface">
        <ul className="divide-y divide-line/70">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex gap-3">
                <Avatar name={comment.name} initials={comment.initials} size={36} />
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-ui text-[13px] text-ink">{comment.name}</span>
                    <span className="font-ui text-[11px] text-ink-soft">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[520px] font-body text-[14px] leading-relaxed text-ink-soft">
                    {comment.body}
                  </p>
                  <Link
                    href={`/${comment.slug}`}
                    className="mt-2 inline-block font-ui text-[11px] uppercase tracking-[0.08em] text-ink-soft hover:text-ink"
                  >
                    on {comment.postTitle} →
                  </Link>
                </div>
              </div>
              <div className="flex shrink-0 gap-2 sm:pl-4">
                <span
                  title="Not wired up yet"
                  className="h-fit cursor-not-allowed border border-line px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.08em] text-ink-soft"
                >
                  Reply
                </span>
                <span
                  title="Not wired up yet"
                  className="h-fit cursor-not-allowed border border-line px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.08em] text-ink-soft"
                >
                  Delete
                </span>
              </div>
            </li>
          ))}
          {comments.length === 0 && (
            <li className="px-6 py-10 text-center font-ui text-[12px] text-ink-soft">
              No comments yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
