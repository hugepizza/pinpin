import { PinList, PinListSkeleton } from "@/components/pin-list";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { create } from "domain";
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
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile userId={userId} />
      </Suspense>
      <Suspense fallback={<PinListSkeleton />}>
        <PinList params={{ userId: userId, page }} />
      </Suspense>
    </main>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-row w-full justify-end">
      <div className="w-1/5 flex flex-col space-y-1 items-end">
        <Skeleton className="h-[30px] w-2/3 rounded-md" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

async function Profile({ userId }: { userId: string }) {
  const supabse = createClient();
  const user = await supabse
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  const { count: published } = await supabse
    .from("pin")
    .select("*", { count: "exact" })
    .eq("user_id", userId);
  if (!user.data) {
    return null;
  }
  return (
    <div className="w-full rounded-sm shadow-sm bg-background px-2 py-2 text-end">
      <div className="text-lg">{user.data.nickname}</div>
      {published && <div>发车{published}次</div>}
      <div>
        注册于 {dayjs(user.data.created_at).toDate().toLocaleDateString()}
      </div>
    </div>
  );
}
