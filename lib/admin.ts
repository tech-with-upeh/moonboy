import { db } from "@/lib/db";
import { seedFor, type Comment } from "@/lib/social";
import { toPost, type Post } from "@/lib/posts";

export interface PostWithStats extends Post {
  likes: number;
  commentCount: number;
}

export interface CommentWithPost extends Comment {
  slug: string;
  postTitle: string;
}

export async function getPostsWithStats(): Promise<PostWithStats[]> {
  const rows = await db.post.findMany({ where: { published: true }, orderBy: { date: "desc" } });
  return rows.map((row) => {
    const post = toPost(row);
    const { likes, comments } = seedFor(post.slug);
    return { ...post, likes, commentCount: comments.length };
  });
}

export async function getAllPosts(): Promise<Post[]> {
  const rows = await db.post.findMany({ where: { published: true }, orderBy: { date: "desc" } });
  return rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await db.post.findFirst({ where: { slug, published: true } });
  return row ? toPost(row) : null;
}

export async function getAllComments(): Promise<CommentWithPost[]> {
  const posts = await getAllPosts();
  const all: CommentWithPost[] = [];
  for (const post of posts) {
    const { comments } = seedFor(post.slug);
    for (const comment of comments) all.push({ ...comment, slug: post.slug, postTitle: post.title });
  }
  return all.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getTotals() {
  const withStats = await getPostsWithStats();
  const totalPosts = withStats.length;
  const totalLikes = withStats.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = withStats.reduce((sum, p) => sum + p.commentCount, 0);
  const avgReadTime = Math.round(withStats.reduce((sum, p) => sum + p.readTime, 0) / (totalPosts || 1));
  return { totalPosts, totalLikes, totalComments, avgReadTime };
}
