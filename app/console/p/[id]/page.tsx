import { notFound } from "next/navigation";
import { ALL_PARCELS, getParcel } from "@/lib/data";
import ConsoleRecord from "./ConsoleRecord";

export function generateStaticParams() {
  return ALL_PARCELS.map((p) => ({ id: p.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parcel = getParcel(id);
  if (!parcel) notFound();
  return <ConsoleRecord parcel={parcel} />;
}
