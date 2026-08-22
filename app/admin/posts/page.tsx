import Link from "next/link";
import { getPostsWithStats } from "@/lib/admin";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function AdminPosts() {
  const posts = [...getPostsWithStats()].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-script text-2xl text-ink">Posts</h1>
          <p className="mt-1 font-body text-[14px] text-ink-soft">
            {posts.length} published posts.
          </p>
        </div>
        <span
          title="Wire this up to the editor"
          className="inline-flex w-fit cursor-not-allowed items-center gap-2 bg-ink/40 px-5 py-2.5 font-ui text-[12px] uppercase tracking-[0.12em] text-sky"
        >
          New post
          <span className="rounded-full border border-surface/40 px-2 py-0.5 text-[9px]">
            Soon
          </span>
        </span>
      </div>

      <div className="mt-8 border border-line bg-surface">
        <table className="w-full text-left">
          <thead>
            <tr className="font-ui text-[11px] uppercase tracking-[0.08em] text-ink-soft">
              <th className="px-6 py-3 font-normal">Title</th>
              <th className="hidden px-4 py-3 font-normal md:table-cell">Author</th>
              <th className="hidden px-4 py-3 font-normal sm:table-cell">Date</th>
              <th className="px-4 py-3 font-normal">Read</th>
              <th className="px-4 py-3 font-normal">Likes</th>
              <th className="px-4 py-3 font-normal">Comments</th>
              <th className="px-6 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-t border-line/70">
                <td className="px-6 py-4 font-body text-[14px] text-ink">
                  <Link href={`/${post.slug}`} className="hover:text-moon-deep">
                    {post.title}
                  </Link>
                </td>
                <td className="hidden px-4 py-4 font-ui text-[12px] text-ink-soft md:table-cell">
                  {post.author.name}
                </td>
                <td className="hidden px-4 py-4 font-ui text-[12px] text-ink-soft sm:table-cell">
                  {formatDate(post.date)}
                </td>
                <td className="px-4 py-4 font-ui text-[12px] text-ink-soft">
                  {post.readTime}m
                </td>
                <td className="px-4 py-4 font-ui text-[12px] text-ink-soft">
                  {post.likes}
                </td>
                <td className="px-4 py-4 font-ui text-[12px] text-ink-soft">
                  {post.commentCount}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <span
                      title="Wire this up to the editor"
                      className="cursor-not-allowed border border-line px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.08em] text-ink-soft"
                    >
                      Edit
                    </span>
                    <span
                      title="Not wired up yet"
                      className="cursor-not-allowed border border-line px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.08em] text-ink-soft"
                    >
                      Delete
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
