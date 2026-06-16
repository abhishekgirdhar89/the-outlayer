import { AdminShell } from "@/components/AdminShell";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "New post — The Outlayer Admin" };

export default function NewPost() {
  return (
    <AdminShell active="posts" title="New post" subtitle="Write a new insight.">
      <PostForm />
    </AdminShell>
  );
}
