import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import FeaturedPost from "@/components/FeaturedPost";
import Footer from "@/components/Footer";
import { getPostsWithStats } from "@/lib/admin";

export const dynamic = "force-dynamic";

const BACKGROUNDS: Record<string, string> = {
  "1": "/box1.png",
  "2": "/box2.png",
  "3": "/box3.jpg",
  "4": "/box4.png",
};

export default async function BgTestPage({
  params,
}: {
  params: { n: string };
}) {
  const background = BACKGROUNDS[params.n];
  if (!background) notFound();

  const posts = await getPostsWithStats();
  const latestPosts = posts.slice(0, 6);

  return (
    <main>
      <section className="mx-auto max-w-page px-6 pb-12 pt-10 md:px-10 md:pt-14">
        <FeaturedPost background={background} />
      </section>
      <section className="mx-auto max-w-page px-6 pb-5 pt-4 md:px-10">
        <div className="hairline" />
        {latestPosts.length > 0 && (
          <h2 className="mt-10 font-script text-4xl text-ink sm:text-5xl">
            Latest Posts
          </h2>
        )}
      </section>
      {latestPosts.length > 0 && (
        <section className="mx-auto grid max-w-page grid-cols-1 gap-x-8 gap-y-12 px-6 pb-24 pt-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </section>
      )}
      <Footer
        src={["/left.png", "/right.png"]}
        alt={["Left flourish", "Right flourish"]}
        isdual
      />
    </main>
  );
}