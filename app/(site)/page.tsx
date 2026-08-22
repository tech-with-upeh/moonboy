import ArticleCard from "@/components/ArticleCard";
import FeaturedPost from "@/components/FeaturedPost";
import Footer from "@/components/Footer";
import { posts } from "@/lib/posts";

const latestPosts = [...posts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 6);

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-page px-6 pb-10 pt-10 md:px-10 md:pt-14">
        <div className="grid items-center gap-5 md:grid-cols-[minmax(120px,1fr)_minmax(0,680px)_minmax(120px,1fr)] md:gap-8">
          <div className="relative hidden h-[280px] md:block">
            <img src="/left.png" alt="Decorative left flourish" className="h-full w-full object-contain" />
          </div>

          <div className="min-w-0">
            <div className="mb-7 text-center">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">Search the directory</p>
              <div className="mx-auto mt-3 max-w-xl">
                <div className="directory-line flex items-center bg-transparent px-4 py-2.5">
                  <input
                    type="search"
                    placeholder="Search..."
                    aria-label="Search directory"
                    className="w-full bg-transparent font-body text-[15px] text-ink outline-none placeholder:text-ink-soft"
                  />
                </div>
              </div>
            </div>
            <FeaturedPost />
          </div>

          <div className="relative hidden h-[280px] md:block">
            <img src="/right.png" alt="Decorative right flourish" className="h-full w-full object-contain" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 pb-5 pt-4 md:px-10">
        <h2 className="font-script text-5xl text-ink sm:text-6xl">Blue Almonds</h2>
        <p className="mt-2 max-w-[500px] font-ui text-[13px] text-ink-soft">
          Music I want to put on the blog.
        </p>
      </section>

      <section className="mx-auto max-w-page px-6 pb-16 pt-5 md:px-10">
        <FeaturedPost />
      </section>

      <section className="mx-auto max-w-page px-6 pb-5 pt-4 md:px-10">
        <div className="hairline" />
        <h2 className="mt-10 font-script text-4xl text-ink sm:text-5xl">Latest Posts</h2>
      </section>

      <section className="mx-auto grid max-w-page grid-cols-1 gap-x-8 gap-y-12 px-6 pb-24 pt-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
        {latestPosts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>

      <Footer src={["/left.png", "/right.png"]} alt={["Left flourish", "Right flourish"]} isdual />
    </main>
  );
}
