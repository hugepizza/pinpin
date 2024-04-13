import CategoryNav from "@/components/cate-nav";
import ImageView from "@/components/image-view";
import ServiceLogo from "@/components/logo";
import { PublishInfomation } from "@/components/pin-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Alert from "./alart";
import { BuildinServices } from "@/types";

export default async function Index({ params }: { params: { slug: string } }) {
  return (
    <main className="w-full flex flex-col items-start my-2 -mx-2 space-y-2 h-full grow">
      <Suspense fallback={<PinSkeleton />}>
        <Pin id={params.slug} />
      </Suspense>
    </main>
  );
}

async function Pin({ id }: { id: string }) {
  const supabase = createClient();
  const { data: pin } = await supabase
    .from("pin")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();
  if (!pin) {
    return notFound();
  }
  return (
    <main className="w-full flex flex-col space-y-1">
      <div className="w-full flex flex-col bg-background shadow-sm rounded-sm px-2 py-2 space-y-1">
        <BreadcrumbNav
          path={[
            { title: "Home", route: "/" },
            {
              title: pin.service,
              route:
                "/category/" +
                Object.keys(BuildinServices).findIndex(
                  (key) => key === pin.service
                ),
            },
          ]}
        />
        <PinTitle {...pin} />
        <PublishInfomation
          author={"xx"}
          publishedAt={dayjs(pin.created_at).toDate()}
        />
        <hr className="hr" />
        <div className="p-1">{pin.description}</div>
        <ImageView
          images={[
            "https://loremflickr.com/640/480?lock=5268937814048768",
            "https://loremflickr.com/640/480?lock=6311192440078336",
            "https://deothemes.com/envato/zenna/html/img/shop/shop_item_back_3.jpg",
          ]}
        />
      </div>
      <div className="w-full flex flex-col bg-background shadow-sm rounded-sm px-2 py-2 space-y-1">
        <table className="w-full">
          {/* <thead>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                King's Treasury
              </th>
              <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                People's happiness
              </th>
            </tr>
          </thead> */}
          <tbody>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                开通地区
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {pin.region}
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                限制节点
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {pin.allow_region ? pin.allow_region : "不限制"}
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                总车位
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {pin.total_slot}
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                已上车
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {pin.occupied_slot}
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                车票
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {(pin.total_slot / pin.total_price).toFixed(2)}元
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <div className="h-2" />
          <Alert link={pin.telegram_link} />
          <div className="h-12" />
          <div className="text-secondary">遇到灵车？</div>
        </div>
      </div>
    </main>
  );
}

function PinSkeleton() {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Skeleton className="h-[30px] w-full rounded-xl" />
      <Skeleton className="h-[30px] w-full rounded-xl" />
      <Skeleton className="h-[30px] w-full rounded-xl" />
      <Skeleton className="h-[80px] w-full rounded-xl" />
      <Skeleton className="h-[160px] w-full rounded-xl" />
    </div>
  );
}

export function PinTitle({
  service,
  title,
  id,
}: {
  service: string;
  title: string;
  id: number;
}) {
  return (
    <div className="flex flex-row gap-1 items-center justify-start">
      <ServiceLogo service={service} />
      <span className={cn("text-xl")}>{title}</span>
    </div>
  );
}

function BreadcrumbNav({ path }: { path: { route: string; title: string }[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((p, index) => (
          <>
            <BreadcrumbItem key={p.route}>
              <BreadcrumbLink href={p.route}>{p.title}</BreadcrumbLink>
            </BreadcrumbItem>
            {index !== path.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
