import ArticleCard from "@/components/ArticleCard";
import FeaturedPost from "@/components/FeaturedPost";
import Footer from "@/components/Footer";
import { getPostsWithStats } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getPostsWithStats();
  const latestPosts = posts.slice(0, 6);

  return <main>
    <section className="mx-auto max-w-page px-6 pb-12 pt-10 md:px-10 md:pt-14">
      <div className="mb-5"><h1 className="font-script text-5xl text-ink sm:text-6xl">Blue Almonds</h1><p className="mt-2 max-w-[500px] font-ui text-[13px] text-ink-soft">Music I want to put on the blog.</p></div>
      <FeaturedPost />
    </section>
    <section className="mx-auto max-w-page px-6 pb-5 pt-4 md:px-10"><div className="hairline" />{latestPosts.length > 0 && <h2 className="mt-10 font-script text-4xl text-ink sm:text-5xl">Latest Posts</h2>}</section>
    {latestPosts.length > 0 ? <section className="mx-auto grid max-w-page grid-cols-1 gap-x-8 gap-y-12 px-6 pb-24 pt-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3">{latestPosts.map((post) => <ArticleCard key={post.slug} post={post} />)}</section> : <section className="mx-auto flex max-w-page flex-col items-center justify-center px-6 pb-28 pt-10 text-center md:px-10"><img src="/nopost.svg" alt="No posts yet" className="h-auto w-full max-w-[360px]" /><div className="mt-7 max-w-md"><h2 className="font-script text-4xl text-ink sm:text-5xl">No posts yet</h2><p className="mt-3 font-body text-[15px] leading-7 text-ink-soft">Nothing has been published here just yet. Come back soon for stories, thoughts, and little things worth sharing.</p></div></section>}
    <Footer src={["/left.png", "/right.png"]} alt={["Left flourish", "Right flourish"]} isdual />
  </main>;
}
