import Avatar from "@/components/Avatar";
import type { Author } from "@/lib/posts";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function PostMeta({
  author,
  date,
  readTime,
  size = "sm",
}: {
  author: Author;
  date: string;
  readTime: number;
  size?: "sm" | "md";
}) {
  const avatarSize = size === "sm" ? 28 : 40;
  const textSize = size === "sm" ? "text-[12px]" : "text-[13px]";

  return (
    <div className="flex items-center justify-center gap-2.5">
      <Avatar name={author.name} initials={author.initials} size={avatarSize} />
      <div className={`text-left font-ui font-medium ${textSize} leading-tight text-ink-soft`}>
        <span className="text-ink">{author.name}</span>
        <div className="mt-0.5">
          {formatDate(date)} · {readTime} min read
        </div>
      </div>
    </div>
  );
}
