import AdminComments from "@/components/AdminComments";
import { getAllComments } from "@/lib/admin";

export default async function AdminCommentsPage() {
  const comments = await getAllComments();
  return <AdminComments initialComments={comments} />;
}
