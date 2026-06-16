import { AdminShell } from "@/components/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "New project — The Outlayer Admin" };

export default function NewProject() {
  return (
    <AdminShell active="projects" title="New project" subtitle="Add a portfolio project.">
      <ProjectForm />
    </AdminShell>
  );
}
