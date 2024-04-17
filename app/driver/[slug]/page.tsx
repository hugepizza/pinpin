import { PinList, PinListSkeleton } from "@/components/pin-list";
import { Suspense } from "react";

export default async function Index({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const pageStr = (searchParams?.page as string) ?? "1";
  const page = parseInt(pageStr, 10);
  const userId: string = decodeURIComponent(params.slug ?? "");
  return (
    <main className="w-full flex flex-col items-start my-1 space-y-1 h-full grow text-sm">
      <Suspense fallback={<PinListSkeleton />}>
        <PinList params={{ userId: userId, page }} />
      </Suspense>
    </main>
  );
}
