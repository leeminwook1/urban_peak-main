import ProjectsClient from "./projects-client";
import { fetchProjects, fetchPageSetting } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, setting] = await Promise.all([
    fetchProjects(),
    fetchPageSetting("projects"),
  ]);
  return <ProjectsClient initialProjects={projects} setting={setting} />;
}
