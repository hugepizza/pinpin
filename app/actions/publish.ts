"use server";

import { publishFormSchema } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const publish = async (values: z.infer<typeof publishFormSchema>) => {
  const supabase = createClient();
  const auth = await supabase.auth.getUser();
  if (!auth.data.user) {
    return;
  }

  console.log(123);

  const { error } = await supabase
    .from("pin")
    .insert([{ ...values, user_id: auth.data.user.id }]);
  if (error) {
    throw new Error(error.message);
  }
};

export default publish;
