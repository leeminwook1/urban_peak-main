import HomeClient from "./home-client";
import { fetchProjects, fetchTeamMembers, fetchMerchandise } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, members, merchandise] = await Promise.all([
    fetchProjects(),
    fetchTeamMembers(),
    fetchMerchandise(),
  ]);
  return (
    <HomeClient
      initialProjects={projects}
      initialMembers={members}
      initialMerchandise={merchandise}
    />
  );
}
