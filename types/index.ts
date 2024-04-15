import { Database } from "@/database.types";
import { z } from "zod";

export const BuildinServices: Record<string, string> = {
  YouTube: "youtube",
  Duolingo: "duolingo",
  Netflix: "netflix",
  Spotify: "spotify",
  ChatGPT: "chatgpt",
  "Apple Music": "apple-music",
  任天堂: "nintento",
};
export enum PinPeriod {
  MONTHLY = "monthly",
  WEEKLY = "weekly",
  QUARTERLY = "quarterly",
  ANNUALLY = "annually",
  PERMANENT = "permanent",
}
enum PinStatus {
  ACTIVE = "active",
  FULL = "full",
  CLOSED = "closed",
}

export type Pin = Database["public"]["Tables"]["pin"]["Row"];

export const publishFormSchema = z
  .object({
    title: z
      .string()
      .min(1, {
        message: "标题至少1个字",
      })
      .max(100, {
        message: "标题最多100字",
      }),
    total_price: z.coerce
      .number()
      .min(1, {
        message: "什么车怎么便宜？车票至少1元",
      })
      .max(10000, {
        message: "什么车这么贵？最多10000元",
      }),
    total_slot: z.coerce
      .number()
      .min(1, {
        message: "没车位发什么车？",
      })
      .max(24, {
        message: "你这是公交车吗？最多24个车位",
      }),
    occupied_slot: z.coerce.number().min(0).max(24, {
      message: "最多24",
    }),
    region: z
      .string()
      .min(1, {
        message: "这是哪儿的车？",
      })
      .max(50, {
        message: "最多50字",
      }),
    allow_region: z.string().min(0).max(50, {
      message: "最多50字",
    }),
    period: z.nativeEnum(PinPeriod),
    service: z
      .string()
      .min(1, {
        message: "宁这车往哪儿开？",
      })
      .max(20, {
        message: "最多20字",
      }),
  })
  .refine((data) => data.occupied_slot < data.total_slot, {
    message: "超载了吧？",
    path: ["occupied_slot"],
  });
