import Link from "next/link";
import { getAdminPostsWithStats } from "@/lib/admin";
import AdminPosts from "@/components/AdminPosts";

export default async function AdminPostsPage() {
  const posts = await getAdminPostsWithStats();
  return (
    <div className="px-5 py-8 sm:px-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="mb-2 font-ui text-[10px] uppercase tracking-[0.2em] text-ink-soft">Content</div><h1 className="font-script text-[32px] leading-none text-ink">Posts</h1><p className="mt-3 max-w-xl font-body text-[14px] leading-6 text-ink-soft">Manage your stories, keep an eye on engagement, and shape what appears on Moonboy.</p></div>
          <Link href="/admin/posts/new" className="group inline-flex h-11 items-center justify-center gap-2 bg-ink px-5 font-ui text-[11px] uppercase tracking-[0.14em] text-sky transition-opacity hover:opacity-90"><span>New post</span><span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5"><path d="M5 15 15 5M7 5h8v8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></Link>
        </div>
        <AdminPosts initialPosts={posts} />
      </div>
    </div>
  );
}
