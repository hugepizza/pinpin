import { Pin, PinPeriod } from "@/types";
import ServiceLogo from "../logo";
import dayjs from "dayjs";
import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { cn, formatTimeAgo } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  params: { service?: string; kw?: string; page: number; userId?: string };
}) {
  const pageSize = 10;
  const fetch = async ({ service, kw, page, userId }: typeof params) => {
    const supabase = createClient();
    const offsetPage = page - 1 < 0 ? 0 : page - 1;
    const sql = supabase
      .from("pin")
      .select("*", { count: "exact" })
      .range(offsetPage * pageSize, offsetPage * pageSize + pageSize - 1)
      .order("created_at", {
        ascending: false,
      });
    if (userId) {
      sql.eq("user_id", userId);
    } else {
      if (service) {
        sql.eq("service", service);
      } else {
        if (kw) {
          sql.or(`service.like.%${kw}%,title.like.%${kw}%`);
        }
      }
    }

    const { data: pin } = await sql;
    if (pin) {
      const userIds = pin.map((p) => p.user_id);
      const users = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);
      return pin.map((p) => ({
        ...p,
        nickname: users.data?.find((d) => p.user_id === d.id)?.nickname || "",
      }));
    }
    return [];
  };
  const pin = await fetch(params);
  if (pin === null || pin.length === 0) {
    return <EmptyServiceList />;
  }
  return (
    <div className="w-full bg-background px-2 rounded-sm shadow-sm">
      {pin.map((pin) => (
        <ListItem pin={pin} key={pin.id} />
      ))}
      <Pagination>
        <PaginationContent className="grid grid-cols-2">
          <PaginationItem className="grid-cols-1">
            {params.page > 1 ? (
              <PaginationPrevious
                href={
                  params.userId
                    ? `/me?page=${params.page - 1}`
                    : `/category/${params.service}?kw=${params.kw}&page=${
                        params.page - 1
                      }`
                }
              />
            ) : (
              <PaginationPrevious
                href={`#`}
                className="text-muted pointer-events-none hover:cursor-not-allowed"
              />
            )}
          </PaginationItem>

          <PaginationItem className="grid-cols-1">
            {pin.length < pageSize ? (
              <PaginationNext
                href={`#`}
                className="text-muted pointer-events-none hover:cursor-not-allowed"
              />
            ) : (
              <PaginationNext
                href={
                  params.userId
                    ? `/me?page=${params.page + 1}`
                    : `/category/${params.service}?kw=${params.kw}&page=${
                        params.page + 1
                      }`
                }
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function ListItem(props: { pin: Pin }) {
  return (
    <div className="flex flex-row py-1 space-y-1 space-x-2 justify-between w-full border-b last:border-b-0">
      <ServiceLogo service={props.pin.service} />
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
    <div className="flex flex-row gap-1 items-center justify-start text-base">
      <p
        className={cn("hover:text-primary duration-200 ease-in-out line-clamp-1", className)}
      >
        {title}
      </p>
    </div>
  );
}

function PinOverview({ pin }: { pin: Pin }) {
  return (
    <div className="grow flex flex-col justify-between">
      <Link
        className="flex flex-col hover:cursor-pointer"
        href={`/pin/${pin.id}`}
      >
        <PinTitle service={pin.service} title={pin.title} id={pin.id} />
      </Link>
      <RegionInformation
        allow_region={pin.allow_region}
        region={pin.region}
        author={pin.nickname}
        authorId={pin.user_id!}
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
        ? "季"
        : "年"}
    </div>
  );
}

function RegionInformation({
  author,
  authorId,
  publishedAt,
  region,
  allow_region,
}: {
  region: string;
  allow_region: string;
  author: string;
  authorId: string;
  publishedAt: Date;
}) {
  return (
    <div className="flex flex-row justify-start items-center text-xs text-muted-foreground">
      <Link
        href={`/driver/${authorId}`}
        className="font-medium text-foreground"
      >
        {author}
      </Link>
      &nbsp;&bull;&nbsp;
      <span>{formatTimeAgo(publishedAt)}</span>
      &nbsp;&bull;&nbsp;
      <span>{region}</span>
      &nbsp;&bull;&nbsp;
      <span>{allow_region.length === 0 ? "不限节点" : `限定节点`}</span>
    </div>
  );
}

export function PublishInfomation({
  author,
  authorId,
  publishedAt,
  className = "",
}: {
  author: string;
  authorId: string;
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
      <Link href={`/driver/${authorId}`} className="font-medium">
        {author}
      </Link>
      <span className="text-xs text-muted-foreground">发布于</span>
      <span className="text-xs text-muted-foreground">
        {formatTimeAgo(publishedAt)}
      </span>
    </div>
  );
}

function PinStatus({ pin }: { pin: Pin }) {
  return (
    <div className="flex flex-col justify-center items-end grow-0 min-w-[24%]">
      <span>
        {pin.occupied_slot === pin.total_slot ? (
          <span className="text-accent-foreground">已满</span>
        ) : (
          <Link
            className="flex flex-col hover:cursor-pointer"
            href={`/pin/${pin.id}`}
          >
            <div>
              <span className="text-muted-foreground text-xs">拼车中 </span>
              <span>
                <span className="text-secondary">{pin.occupied_slot}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-primary">{pin.total_slot}</span>
              </span>
            </div>
            <div className="flex flex-row">
              <PriceWithPeriod
                period={pin.period as PinPeriod}
                price={pin.total_price / pin.total_slot}
              />
            </div>
          </Link>
        )}
      </span>
    </div>
  );
}

function EmptyServiceList() {
  return (
    <div className="w-full h-full flex justify-center grow">
      <div className="absolute top-1/4">
        <i className="icon icon-people"></i>
        <p className="text-2xl">暂时没有车队</p>
        <p className="empty-subtitle">我来当车主 去发车</p>
      </div>
    </div>
  );
}
