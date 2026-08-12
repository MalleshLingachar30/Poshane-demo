import { ALL_PARCELS, getParcel } from "@/lib/data";
import PublicRecord from "./PublicRecord";
import JustIssued from "./JustIssued";

export function generateStaticParams() {
  return ALL_PARCELS.map((p) => ({ id: p.id }));
}

// A Location ID issued during a demonstration does not exist at build time.
// Its tag should still resolve to something honest rather than a 404.
export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parcel = getParcel(id);
  return parcel ? <PublicRecord parcel={parcel} /> : <JustIssued id={id} />;
}
