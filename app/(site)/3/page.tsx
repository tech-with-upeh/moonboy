import ArticleCard from "@/components/ArticleCard";
import FeaturedPost from "@/components/FeaturedPost";
import Footer from "@/components/Footer";
import { posts } from "@/lib/posts";

export default function Home() {
  const favorites = posts.filter((p) => p.favorite);
  const rest = posts.filter((p) => !p.favorite);

  return (
    <main>
      <div className="mx-auto max-w-page px-6 pb-10 pt-14 md:px-10">
        <FeaturedPost />
      </div>

      <div className="mx-auto max-w-page px-6 pb-4 pt-4 md:px-10">
        <h2 className="font-script text-4xl text-ink sm:text-5xl">
          The Fortnight Favorites
        </h2>
        <p className="mt-2 max-w-[440px] font-ui text-[13px] text-ink-soft">
          A few things I've loved writing lately.
        </p>
      </div>

      <div className="mx-auto grid max-w-page grid-cols-1 gap-x-8 gap-y-12 px-6 pb-16 pt-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
        {favorites.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mx-auto max-w-page px-6 md:px-10">
        <div className="hairline" />
      </div>

      <div className="mx-auto max-w-page px-6 pb-4 pt-12 md:px-10">
        <h2 className="font-script text-3xl text-ink">Everything else</h2>
      </div>

      <div className="mx-auto grid max-w-page grid-cols-1 gap-x-8 gap-y-12 px-6 pb-24 pt-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
        {rest.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
            <Footer
src="/starsbg.png"
  alt="bottom footer flourish"
  
/>
    </main>
  );
}
