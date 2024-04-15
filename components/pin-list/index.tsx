import { Pin, PinPeriod } from "@/types";
import ServiceLogo from "../logo";
import dayjs from "dayjs";
import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PinListSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-row w-full justify-between">
          <div className="w-2/3 flex flex-col space-y-1">
            <Skeleton className="h-[30px] w-full rounded-md" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="w-1/3 flex flex-col space-y-1 items-end">
            <Skeleton className="h-[30px] w-2/3 rounded-md" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </>
  );
}
export async function PinList({
  params,
}: {
  params: { service: string; kw: string };
}) {
  const fetch = async ({ service, kw }: { service: string; kw: string }) => {
    const supabase = createClient();
    const sql = supabase.from("pin").select("*", { count: "exact" });
    if (service) {
      sql.eq("service", service);
    } else {
      if (kw) {
        sql.or(`service.like.%${kw}%,title.like.%${kw}%`);
      }
    }

    return await sql;
  };
  const { data: pin } = await fetch(params);

  if (pin === null || pin.length === 0) {
    return <EmptyServiceList />;
  }
  return (
    <div className="w-full bg-background px-2 rounded-sm shadow-sm">
      {pin.map((pin) => (
        <ListItem pin={pin} key={pin.id} />
      ))}
    </div>
  );
}

function ListItem(props: { pin: Pin }) {
  return (
    <div className="relative flex flex-row py-2 space-y-1 justify-between w-full border-b last:border-b-0">
      <PinOverview pin={props.pin} />
      <PinStatus pin={props.pin} />
    </div>
  );
}

export function PinTitle({
  service,
  title,
  id,
  className = "",
}: {
  service: string;
  title: string;
  id: number;
  className?: string;
}) {
  return (
    <div className="flex flex-row gap-1 items-center justify-start">
      <ServiceLogo service={service} />
      <Link
        href={`/pin/${id}`}
        className={cn(
          "text-lg hover:text-primary duration-200 ease-in-out",
          className
        )}
      >
        {title}
      </Link>
    </div>
  );
}

function PinOverview({ pin }: { pin: Pin }) {
  return (
    <div>
      <PinTitle service={pin.service} title={pin.title} id={pin.id} />
      <RegionInformation allow_region={pin.allow_region} region={pin.region} />
      <PublishInfomation
        author={"test"}
        publishedAt={dayjs(pin.created_at).toDate()}
      />
    </div>
  );
}

function PriceWithPeriod({
  price,
  period,
}: {
  price: number;
  period: PinPeriod;
}) {
  return (
    <div>
      {price.toFixed(2)}元/
      {period === PinPeriod.WEEKLY
        ? "周"
        : period === PinPeriod.MONTHLY
        ? "月"
        : period === PinPeriod.QUARTERLY
        ? "季度"
        : "年"}
    </div>
  );
}

function RegionInformation({
  region,
  allow_region,
}: {
  region: string;
  allow_region: string;
}) {
  return (
    <div className="flex flex-row justify-start items-center text-sm space-x-1">
      <span>{region}区</span>
      <span>{allow_region.length === 0 ? "不限节点" : `限定节点`}</span>
    </div>
  );
}

export function PublishInfomation({
  author,
  publishedAt,
  className = "",
}: {
  author: string;
  publishedAt: Date;
  className?: string;
}) {
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime(); // 差异（毫秒）

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}天前`;
    } else if (hours > 0) {
      return `${hours}小时前`;
    } else if (minutes > 0) {
      return `${minutes}分钟前`;
    } else {
      return "1分钟内";
    }
  };
  return (
    <div className={cn("text-sm space-x-1", className)}>
      <a href="" className="font-medium">
        {author}
      </a>
      <span className="text-xs text-muted-foreground">发布于</span>
      <span className="text-xs text-muted-foreground">
        {formatTimeAgo(publishedAt)}
      </span>
    </div>
  );
}

function PinStatus({ pin }: { pin: Pin }) {
  return (
    <div className="flex flex-col justify-center relative">
      <Link href={`/pin/${pin.id}`} className="absolute w-full h-full" />
      <span>
        {pin.occupied_slot === pin.total_slot ? (
          <span className="text-accent-foreground">已满</span>
        ) : (
          <a
            className="flex flex-col hover:cursor-pointer"
            href={pin.telegram_link}
            target="_blank"
          >
            <div>
              <span className="text-muted-foreground text-sm">拼车中 </span>
              <span>
                <span className="text-secondary text-2xl">
                  {pin.occupied_slot}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-primary text-xl">{pin.total_slot}</span>
              </span>
            </div>
            <div className="flex flex-row">
              <PriceWithPeriod
                period={pin.period as PinPeriod}
                price={pin.total_price / pin.total_slot}
              />
            </div>
          </a>
        )}
      </span>
    </div>
  );
}

function EmptyServiceList() {
  return (
    <div className="w-full h-full flex justify-center relative grow">
      <div className="absolute top-1/4">
        <i className="icon icon-people"></i>
        <p className="text-2xl">暂时没有车队</p>
        <p className="empty-subtitle">我来当车主 去发车</p>
      </div>
    </div>
  );
}
