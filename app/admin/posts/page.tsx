import { getPostsWithStats } from "@/lib/admin";
import AdminPosts from "@/components/AdminPosts";

export default async function AdminPostsPage() {
  const posts = await getPostsWithStats();
  return <AdminPosts initialPosts={posts.map((post) => ({ ...post, published: true }))} />;
}
