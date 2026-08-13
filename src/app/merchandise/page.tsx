import MerchandiseClient from "./merchandise-client";
import { fetchMerchandise, fetchMerchandiseSections, fetchPageSetting } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function MerchandisePage() {
  const [sections, items, setting] = await Promise.all([
    fetchMerchandiseSections(),
    fetchMerchandise(),
    fetchPageSetting("merchandise"),
  ]);
  return <MerchandiseClient sections={sections} items={items} setting={setting} />;
}
