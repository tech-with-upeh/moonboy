import Link from "next/link";
import { getPostsWithStats } from "@/lib/admin";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function IconArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 15 15 5M7 5h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 16.2S3.5 12.5 3.5 7.7A3.2 3.2 0 0 1 10 6.5a3.2 3.2 0 0 1 6.5 1.2c0 4.8-6.5 8.5-6.5 8.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconComment() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.5">
      <path d="M3.5 4.5h13v8H8l-4.5 3v-11Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function AdminPosts() {
  const posts = await getPostsWithStats();

  return (
    <div className="px-5 py-8 sm:px-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 font-ui text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Content
            </div>
            <h1 className="font-script text-[32px] leading-none text-ink">Posts</h1>
            <p className="mt-3 max-w-xl font-body text-[14px] leading-6 text-ink-soft">
              Manage your stories, keep an eye on engagement, and shape what appears on Moonboy.
            </p>
          </div>

          <Link
            href="/admin/posts/new"
            className="group inline-flex h-11 items-center justify-center gap-2 bg-ink px-5 font-ui text-[11px] uppercase tracking-[0.14em] text-sky transition-opacity hover:opacity-90"
          >
            <span>New post</span>
            <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <IconArrowUpRight />
            </span>
          </Link>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div className="font-ui text-[11px] uppercase tracking-[0.12em] text-ink-soft">
            {posts.length} {posts.length === 1 ? "published story" : "published stories"}
          </div>
          <div className="hidden font-ui text-[11px] text-ink-soft sm:block">
            Sorted by latest
          </div>
        </div>

        <div className="mt-3 overflow-hidden border border-line bg-surface">
          <div className="hidden border-b border-line bg-[#f8f8f6] px-5 py-3 md:grid md:grid-cols-[minmax(0,1fr)_150px_100px_110px] md:items-center md:gap-4">
            <div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Story</div>
            <div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Published</div>
            <div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Read</div>
            <div className="font-ui text-[10px] uppercase tracking-[0.14em] text-ink-soft">Engagement</div>
          </div>

          {posts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="font-script text-2xl text-ink">Nothing here yet.</div>
              <p className="mt-2 font-body text-sm text-ink-soft">Create your first story to get started.</p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="group border-b border-line last:border-b-0"
                >
                  <div className="grid gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_150px_100px_110px] md:items-center md:gap-4 md:px-5">
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="hidden h-14 w-20 shrink-0 overflow-hidden bg-night/5 sm:block">
                          {post.coverUrl || post.cover ? (
                            <img
                              src={post.coverUrl || post.cover || ""}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-script text-lg text-ink-soft/60">
                              M
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-ui text-[9px] uppercase tracking-[0.12em] text-moon-deep">
                              {post.category}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-ink-soft/40" />
                            <span className="font-ui text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                              Published
                            </span>
                          </div>
                          <Link
                            href={`/${post.slug}`}
                            className="mt-1 block truncate font-body text-[16px] font-medium leading-6 text-ink transition-colors hover:text-moon-deep"
                          >
                            {post.title}
                          </Link>
                          <p className="mt-1 line-clamp-1 max-w-2xl font-body text-[12px] leading-5 text-ink-soft">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:block">
                      <span className="font-ui text-[10px] uppercase tracking-[0.1em] text-ink-soft md:hidden">Published</span>
                      <div className="font-ui text-[12px] text-ink">{formatDate(post.date)}</div>
                    </div>

                    <div className="flex items-center justify-between md:block">
                      <span className="font-ui text-[10px] uppercase tracking-[0.1em] text-ink-soft md:hidden">Read time</span>
                      <div className="font-ui text-[12px] text-ink">{post.readTime} min</div>
                    </div>

                    <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-1.5">
                      <div className="flex items-center gap-1.5 font-ui text-[11px] text-ink-soft" title="Likes">
                        <IconHeart />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-ui text-[11px] text-ink-soft" title="Comments">
                        <IconComment />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
