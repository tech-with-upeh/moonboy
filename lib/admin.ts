import { db } from "@/lib/db";
import { seedFor, type Comment } from "@/lib/social";
import { toPost, type Post } from "@/lib/posts";

export interface PostWithStats extends Post { likes: number; commentCount: number; }
export interface CommentWithPost extends Comment { slug: string; postTitle: string; }

export async function getPostsWithStats(): Promise<PostWithStats[]> {
  const rows = await db.post.findMany({ where: { published: true }, orderBy: { date: "desc" } });
  return Promise.all(rows.map(async (row) => {
    const [likes, commentCount] = await Promise.all([
      db.postLike.count({ where: { postId: row.id } }),
      db.comment.count({ where: { postId: row.id, status: "APPROVED" } }),
    ]);
    return { ...toPost(row), likes, commentCount };
  }));
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
  const rows = await db.comment.findMany({ where: { status: "APPROVED" }, include: { post: { select: { slug: true, title: true } } }, orderBy: { createdAt: "desc" } });
  return rows.map((comment) => ({ id: comment.id, name: comment.name, initials: comment.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join(""), date: comment.createdAt.toISOString(), body: comment.body, slug: comment.post.slug, postTitle: comment.post.title }));
}

export async function getTotals() {
  const withStats = await getPostsWithStats();
  const totalPosts = withStats.length;
  const totalLikes = withStats.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = withStats.reduce((sum, p) => sum + p.commentCount, 0);
  const avgReadTime = Math.round(withStats.reduce((sum, p) => sum + p.readTime, 0) / (totalPosts || 1));
  return { totalPosts, totalLikes, totalComments, avgReadTime };
}
