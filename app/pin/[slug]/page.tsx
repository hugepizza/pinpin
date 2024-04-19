import CategoryNav from "@/components/cate-nav";
import ImageView from "@/components/image-view";
import ServiceLogo from "@/components/logo";
import { PublishInfomation } from "@/components/pin-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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
import Modal from "./modal";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: pin } = await supabase
    .from("pin")
    .select("*")
    .eq("id", params.slug)
    .limit(1)
    .single();
  if (pin) {
    return {
      title: `${pin.title} | ${pin.service} | 拼车/合租/共享`,
      description: `${pin.description ?? pin?.title} | ${
        pin.service
      } 拼车/合租/共享, 发车找车`,
    };
  }
  return {
    title: "YouTube/Netflix/Spotify等平台 | 拼车/合租/共享",
    description: "YouTube/Netflix/Spotify等平台 拼车/合租/共享, 发车找车",
  };
}

export default async function Index({ params }: { params: { slug: string } }) {
  return (
    <main className="w-full flex flex-col items-start my-1 space-y-2 h-full grow">
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
  const user = await supabase
    .from("profiles")
    .select("*")
    .eq("id", pin.user_id!)
    .limit(1)
    .single();
  if (!user.data) {
    return notFound();
  }

  const visitor = await supabase.auth.getUser();
  const isOwner = visitor?.data.user?.id === pin.user_id;

  const beglongService = Object.values(BuildinServices).find(
    (v) => v === pin.service
  );

  return (
    <main className="w-full flex flex-col space-y-1">
      <div className="w-full flex flex-col bg-background shadow-sm rounded-sm px-2 py-2 space-y-1">
        <BreadcrumbNav
          path={[
            { title: "Home", route: "/" },
            {
              title: pin.service,
              route: beglongService
                ? `/category/${beglongService}`
                : `/category?kw=${pin.service}`,
            },
          ]}
        />
        <PinTitle {...pin} />
        <PublishInfomation
          author={user.data.nickname}
          authorId={user.data.id}
          publishedAt={dayjs(pin.created_at).toDate()}
        />
        <hr className="hr" />
        <div className="p-1">{pin.description}</div>
        {pin.images.length > 0 ? (
          <ImageView
            images={pin.images.map(
              (img) =>
                `https://jxiyalqtocywlkrriwcq.supabase.co/storage/v1/object/public/pinpin/${img}`
            )}
          />
        ) : (
          <span className="text-sm text-muted-foreground">
            车主没有上传凭证
          </span>
        )}
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
                {(pin.total_price / pin.total_slot).toFixed(2)}元
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <div>
            <div className="h-2" />
            {pin.occupied_slot < pin.total_slot && (
              <Alert link={"https://" + pin.telegram_link} />
            )}
            <div className="h-12" />
            {/* <div className="text-secondary">遇到灵车？</div> */}
          </div>
          {isOwner && (
            <Modal
              pinId={pin.id}
              occupied={pin.occupied_slot}
              total={pin.total_slot}
            />
          )}
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

function PinTitle({ service, title }: { service: string; title: string }) {
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
