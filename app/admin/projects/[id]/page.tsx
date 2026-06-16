import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminGetProject } from "@/lib/admin-data";
import { deleteProject } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit project — The Outlayer Admin" };

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await adminGetProject(id);
  if (!project) notFound();

  return (
    <AdminShell
      active="projects"
      title="Edit project"
      subtitle={project.title}
      actions={<DeleteButton id={project.id} action={deleteProject} label="Delete project" />}
    >
      <ProjectForm project={project} />
    </AdminShell>
  );
}
