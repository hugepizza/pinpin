import { PinList, PinListSkeleton } from "@/components/pin-list";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const pageStr = (searchParams?.page as string) ?? "1";
  const page = parseInt(pageStr, 10);
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    redirect("/login");
  }

  return (
    <main className="w-full flex flex-col items-start my-1 space-y-1 h-full grow text-sm">
      <Suspense fallback={<PinListSkeleton />}>
        <PinList params={{ page, userId: user.data.user.id }} />
      </Suspense>
    </main>
  );
}
