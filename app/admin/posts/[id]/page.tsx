import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminGetPost } from "@/lib/admin-data";
import { deletePost } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post — The Outlayer Admin" };

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await adminGetPost(id);
  if (!post) notFound();

  return (
    <AdminShell
      active="posts"
      title="Edit post"
      subtitle={post.title}
      actions={<DeleteButton id={post.id} action={deletePost} label="Delete post" />}
    >
      <PostForm post={post} />
    </AdminShell>
  );
}
