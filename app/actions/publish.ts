"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export const publish = async (formData: FormData) => {
  "use server";
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  setTimeout(() => {
  }, 2000);
  // const service = formData.get("service") as string;
  // const total_price = formData.get("total_price") as string;
  // const total_slot = formData.get("total_slot") as string;
  // const occupied_slot = formData.get("occupied_slot") as string;
  // const region = formData.get("region") as string;
  // const allow_region = formData.get("allow_region") as string;

  // supabase.from('pin').insert({})
};
