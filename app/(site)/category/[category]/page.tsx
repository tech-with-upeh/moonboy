import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORIES, type Category } from "@/lib/posts";
import { getAllPosts } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = CATEGORIES.find((c) => c.slug === params.category);
  if (!category) return notFound();
  const posts = await getAllPosts();
  const filtered = posts.filter((p) => p.category === (category.slug as Category));

  return (
    <main>
      <div className="mx-auto max-w-page px-6 pb-4 pt-14 text-center md:px-10">
        <h1 className="font-script text-4xl text-ink sm:text-5xl">{category.label}</h1>
        <p className="mt-2 font-ui text-[13px] text-ink-soft">{filtered.length} {filtered.length === 1 ? "post" : "posts"}</p>
      </div>
      <div className="mx-auto grid max-w-page grid-cols-1 gap-x-8 gap-y-12 px-6 pb-24 pt-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
        {filtered.map((post) => <ArticleCard key={post.slug} post={post} />)}
        {filtered.length === 0 && <p className="col-span-full text-center font-ui text-[13px] text-ink-soft">Nothing here yet — check back soon.</p>}
      </div>
    </main>
  );
}
