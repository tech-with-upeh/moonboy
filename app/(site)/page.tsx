import ArticleCard from "@/components/ArticleCard";
import FeaturedPost from "@/components/FeaturedPost";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 6);

  return (
    <main>
      <section className="mx-auto max-w-page px-6 pb-12 pt-10 md:px-10 md:pt-14">
        <div className="mb-5">
          <h1 className="font-script text-5xl text-ink sm:text-6xl">Blue Almonds</h1>
          <p className="mt-2 max-w-[500px] font-ui text-[13px] text-ink-soft">Music I want to put on the blog.</p>
        </div>
        <FeaturedPost />
      </section>
      <section className="mx-auto max-w-page px-6 pb-5 pt-4 md:px-10">
        <div className="hairline" />
        <h2 className="mt-10 font-script text-4xl text-ink sm:text-5xl">Latest Posts</h2>
      </section>
      <section className="mx-auto grid max-w-page grid-cols-1 gap-x-8 gap-y-12 px-6 pb-24 pt-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
        {latestPosts.map((post) => <ArticleCard key={post.slug} post={post} />)}
      </section>
      <Footer src={["/left.png", "/right.png"]} alt={["Left flourish", "Right flourish"]} isdual />
    </main>
  );
}
