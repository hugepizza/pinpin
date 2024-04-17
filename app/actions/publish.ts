"use server";

import { publishFormSchema } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const publish = async (values: z.infer<typeof publishFormSchema>) => {
  const supabase = createClient();
  const auth = await supabase.auth.getUser();
  if (!auth.data.user) {
    return;
  }

  const { error } = await supabase
    .from("pin")
    .insert([{ ...values, user_id: auth.data.user.id }]);

  revalidatePath(`/pin`);
  if (error) {
    throw new Error(error.message);
  }
};

export default publish;
