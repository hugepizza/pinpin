"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchParams, searchParams2QueryUrl } from "@/types";
import { useRouter } from "next/navigation";
function Filters({ params }: { params: SearchParams }) {
  const { push } = useRouter();
  return (
    <div className="flex flex-row justify-end w-full">
      <div>
        <Select
          onValueChange={(e) => {
            const service = params.service;
            const status = e === "active" ? "active" : undefined;
            const newParams = { ...params, status };
            const urlQuery = searchParams2QueryUrl(newParams);
            if (service) {
              push(`/category/${service}/?${urlQuery}`);
            } else {
              push(`/?${urlQuery}`);
            }
          }}
        >
          <SelectTrigger className="h-[2rem]">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="active">有车位</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default Filters;
