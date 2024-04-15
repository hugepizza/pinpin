import { PinList, PinListSkeleton } from "@/components/pin-list";
import { Suspense } from "react";
import CategoryNav from "@/components/cate-nav";

export function generateMetadata({ params }: { params: { service: string } }) {
  const serviceName: string = decodeURIComponent(params.service);
  return {
    title: `${serviceName} 拼车/合租/共享`,
    description: `${serviceName} 拼车/合租/共享`,
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
  const serviceName: string = decodeURIComponent(params.slug ?? "");
  return (
    <main className="w-full flex flex-col items-start my-1 space-y-1 h-full grow text-sm">
      <CategoryNav active={serviceName} />
      <Suspense fallback={<PinListSkeleton />}>
        <PinList params={{ service: serviceName, kw }} />
      </Suspense>
    </main>
  );
}
