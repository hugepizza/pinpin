import { PinList, PinListSkeleton } from "@/components/pin-list";
import { Suspense } from "react";
import CategoryNav from "@/components/cate-nav";
import { Metadata } from "next";
import { SearchParams } from "@/types";
import Filters from "../filter";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const serviceName = params.slug;
  return {
    title: `${serviceName ?? "YouTube/Netflix/Spotify等平台"} | 拼车/合租/共享`,
    description: `${
      serviceName ?? "YouTube/Netflix/Spotify等平台"
    } 拼车/合租/共享, 发车找车`,
  };
}

export default async function Index({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const kw = (searchParams?.kw as string) ?? "";
  const pageStr = (searchParams?.page as string) ?? "1";
  const status = (searchParams?.status as string) ?? "";
  const page = parseInt(pageStr, 10);
  const serviceName: string = decodeURIComponent(params.slug ?? "");
  const query: SearchParams = {
    kw,
    page,
    service: serviceName,
    status: status === "active" ? "active" : undefined,
  };
  return (
    <main className="w-full flex flex-col items-start my-1 space-y-1 h-full grow text-sm">
      <CategoryNav active={serviceName} />
      <Filters params={query} />
      <Suspense fallback={<PinListSkeleton />}>
        <PinList params={query} />
      </Suspense>
    </main>
  );
}
