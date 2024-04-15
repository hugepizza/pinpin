import { type NextRequest } from "next/server";
import { publishFormSchema } from "@/types";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const data = (await request.json()) as z.infer<typeof publishFormSchema>;
  

  return Response.json({});
}
