import { posts, type Post } from "@/lib/posts";
import { seedFor, type Comment } from "@/lib/social";

export interface PostWithStats extends Post {
  likes: number;
  commentCount: number;
}

export interface CommentWithPost extends Comment {
  slug: string;
  postTitle: string;
}

export function getPostsWithStats(): PostWithStats[] {
  return posts.map((post) => {
    const { likes, comments } = seedFor(post.slug);
    return { ...post, likes, commentCount: comments.length };
  });
}

export function getAllComments(): CommentWithPost[] {
  const all: CommentWithPost[] = [];
  for (const post of posts) {
    const { comments } = seedFor(post.slug);
    for (const comment of comments) {
      all.push({ ...comment, slug: post.slug, postTitle: post.title });
    }
  }
  return all.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getTotals() {
  const withStats = getPostsWithStats();
  const totalPosts = withStats.length;
  const totalLikes = withStats.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = withStats.reduce((sum, p) => sum + p.commentCount, 0);
  const avgReadTime = Math.round(
    withStats.reduce((sum, p) => sum + p.readTime, 0) / (totalPosts || 1)
  );
  return { totalPosts, totalLikes, totalComments, avgReadTime };
}
