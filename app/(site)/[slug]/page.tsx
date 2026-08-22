import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import PostMeta from "@/components/PostMeta";
import ShareButtons from "@/components/ShareButtons";
import LikeButton from "@/components/LikeButton";
import Comments from "@/components/Comments";
import { posts } from "@/lib/posts";
import { seedFor } from "@/lib/social";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moonboynewsletter.com";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  const { likes, comments } = seedFor(post.slug);

  return (
    <main>
      <div className="mx-auto max-w-[560px] px-6 pt-6 md:px-10">
        <Cover variant={post.cover} />
      </div>
      <div className="mx-auto max-w-page px-6 py-8 text-center md:px-16">
        <Link
          href={`/category/${post.category}`}
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft hover:text-ink"
        >
          {post.category}
        </Link>
        <h1 className="mt-2 font-script text-[42px] leading-[1.15] text-ink sm:text-[52px]">
          {post.title}
        </h1>
        <p className="mx-auto mt-4 max-w-[440px] font-body italic text-[15px] leading-relaxed text-ink-soft">
          {post.excerpt}
        </p>
      </div>

      <div className="mx-auto flex max-w-page flex-col items-center gap-6 px-6 pb-6 md:flex-row md:items-center md:justify-between md:px-10">
        <PostMeta
          author={post.author}
          date={post.date}
          readTime={post.readTime}
          size="md"
        />
        <div className="flex items-center gap-5">
          <LikeButton slug={post.slug} initialLikes={likes} size="md" />
          <ShareButtons url={`${SITE_URL}/${post.slug}`} title={post.title} />
        </div>
      </div>

      <div className="mx-auto max-w-page px-6 md:px-10">
        <div className="rule" />
      </div>
      <div className="mx-auto max-w-[560px] px-6 py-10 font-body text-[16px] leading-loose text-ink-soft md:px-10">
        <p>
          This is a placeholder for the full post. Swap in real content, or
          wire this route up to your CMS or MDX files of choice.
        </p>
      </div>

      <div className="mx-auto max-w-page px-6 md:px-10">
        <div className="hairline" />
      </div>

      <div className="mx-auto max-w-[560px] px-6 py-12 md:px-10">
        <Comments slug={post.slug} initialComments={comments} />
      </div>
    </main>
  );
}
