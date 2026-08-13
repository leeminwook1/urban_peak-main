import StoryClient from "./story-client";
import { fetchPageSetting } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StoryPage() {
  const setting = await fetchPageSetting("story");
  return <StoryClient setting={setting} />;
}
