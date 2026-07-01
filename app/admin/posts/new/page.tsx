import { AdminShell } from "@/components/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { adminListPostCategories } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "New post — The Outlayer Admin" };

export default async function NewPost() {
  const categories = await adminListPostCategories();
  return (
    <AdminShell active="posts" title="New post" subtitle="Write a new insight.">
      <PostForm categories={categories} />
    </AdminShell>
  );
}
