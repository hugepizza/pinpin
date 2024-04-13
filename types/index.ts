import { Database } from "@/database.types";

export const BuildinServices: Record<string, string> = {
  YouTube: "youtube",
  Duolingo: "duolingo",
  Netflix: "netflix",
  Spotify: "spotify",
  ChatGPT: "chatgpt",
  "Apple Music": "apple-music",
  "Apple One": "apple-one",
};
export enum PinPeriod {
  MONTHLY = "monthly",
  WEEKLY = "weekly",
  QUARTERLY = "quarterly",
  ANNUALLY = "annually",
}
enum PinStatus {
  ACTIVE = "active",
  FULL = "full",
  CLOSED = "closed",
}

export type Pin = Database["public"]["Tables"]["pin"]["Row"];
