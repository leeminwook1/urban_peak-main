import ContactClient from "./contact-client";
import { fetchPageSetting } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const setting = await fetchPageSetting("contact");
  return <ContactClient setting={setting} />;
}
