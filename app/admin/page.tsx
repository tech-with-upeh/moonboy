import Link from "next/link";
import Greeting from "@/components/admin/Greeting";
import ActionCard from "@/components/admin/ActionCard";
import StatCard from "@/components/admin/StatCard";
import Donut from "@/components/admin/Donut";
import Avatar from "@/components/Avatar";
import { getPostsWithStats, getAllComments, getTotals } from "@/lib/admin";

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#15150F" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#FAF9F4" strokeWidth="2">
      <path d="M4 5.5h16v10H9.5L5 19.5v-4H4v-10Z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#FAF9F4" strokeWidth="2">
      <path d="M4 20V4M4 20h16" strokeLinecap="round" />
      <path d="M8 16v-4M12.5 16V7M17 16v-7" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3.5h9l4.5 4.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4c2.1-.3 4 .8 6.5 3 2.5-2.2 4.4-3.3 6.5-3 3.5.5 5 4 3.5 7.2-2.5 4.7-10 9.3-10 9.3Z" />
    </svg>
  );
}
function IconMessage() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5.5h16v10H9.5L5 19.5v-4H4v-10Z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(iso)
  );
}

export default function AdminDashboard() {
  const posts = getPostsWithStats();
  const comments = getAllComments().slice(0, 5);
  const totals = getTotals();

  const recentPosts = [...posts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="px-6 py-8 md:px-10">
      {/* Quick actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <ActionCard
          href="/admin/posts"
          title="New post"
          subtitle="Draft something new"
          icon={<IconPlus />}
          accent="#F2B705"
        />
        <ActionCard
          href="/admin/comments"
          title="Comments"
          subtitle="Moderate the discussion"
          icon={<IconChat />}
          accent="#2F6F6B"
        />
        <ActionCard
          href="/admin/analytics"
          title="Analytics"
          subtitle="See what's landing"
          icon={<IconChart />}
          accent="#181828"
        />
      </div>

      {/* Greeting */}
      <div className="mt-10">
        <Greeting name="Moonboy" />
        <p className="mt-1.5 max-w-[460px] font-body text-[14px] leading-relaxed text-ink-soft">
          Here&apos;s how the blog is doing — posts, engagement, and the
          latest from your readers.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total posts" value={totals.totalPosts} icon={<IconDoc />} />
        <StatCard label="Total likes" value={totals.totalLikes} icon={<IconHeart />} />
        <StatCard label="Total comments" value={totals.totalComments} icon={<IconMessage />} />
        <StatCard label="Avg. read time" value={`${totals.avgReadTime}m`} icon={<IconClock />} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / main column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="border border-line bg-surface p-6">
            <h2 className="font-script text-lg text-ink">
              Engagement breakdown
            </h2>
            <div className="mt-5">
              <Donut
                centerLabel="Total engagement"
                centerValue={totals.totalLikes + totals.totalComments}
                segments={[
                  { label: "Likes", value: totals.totalLikes, color: "#F2B705" },
                  { label: "Comments", value: totals.totalComments, color: "#181828" },
                ]}
              />
            </div>
          </div>

          <div className="border border-line bg-surface">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="font-script text-lg text-ink">
                Recent posts
              </h2>
              <Link
                href="/admin/posts"
                className="font-ui text-[11px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink"
              >
                View all →
              </Link>
            </div>
            <div className="hairline" />
            <table className="w-full text-left">
              <thead>
                <tr className="font-ui text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                  <th className="px-6 py-3 font-normal">Title</th>
                  <th className="hidden px-4 py-3 font-normal sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-normal">Likes</th>
                  <th className="px-4 py-3 font-normal">Comments</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.slug} className="border-t border-line/70">
                    <td className="px-6 py-3.5 font-body text-[14px] text-ink">
                      <Link href={`/${post.slug}`} className="hover:text-moon-deep">
                        {post.title}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3.5 font-ui text-[12px] text-ink-soft sm:table-cell">
                      {formatDate(post.date)}
                    </td>
                    <td className="px-4 py-3.5 font-ui text-[12px] text-ink-soft">
                      {post.likes}
                    </td>
                    <td className="px-4 py-3.5 font-ui text-[12px] text-ink-soft">
                      {post.commentCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="border border-line bg-surface">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-script text-lg text-ink">
              Recent comments
            </h2>
            <Link
              href="/admin/comments"
              className="font-ui text-[11px] uppercase tracking-[0.1em] text-ink-soft hover:text-ink"
            >
              View all →
            </Link>
          </div>
          <div className="hairline" />
          <ul className="divide-y divide-line/70">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3 px-6 py-4">
                <Avatar name={comment.name} initials={comment.initials} size={30} />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-ui text-[12px] text-ink">{comment.name}</span>
                    <span className="font-ui text-[10px] text-ink-soft">
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate font-body text-[13px] text-ink-soft">
                    {comment.body}
                  </p>
                  <Link
                    href={`/${comment.slug}`}
                    className="mt-1 block truncate font-ui text-[11px] text-ink-soft/80 hover:text-ink"
                  >
                    on {comment.postTitle}
                  </Link>
                </div>
              </li>
            ))}
            {comments.length === 0 && (
              <li className="px-6 py-6 text-center font-ui text-[12px] text-ink-soft">
                No comments yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
