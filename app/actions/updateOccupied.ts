"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
const updateOccupied = async ({
  pinId,
  newOccupied,
  total,
}: {
  pinId: number;
  newOccupied: number;
  total: number;
}) => {
  const supabase = createClient();
  await supabase
    .from("pin")
    .update({ occupied_slot: newOccupied > total ? total : newOccupied })
    .eq("id", pinId);
  revalidatePath(`/pin/${pinId}`);
};

export default updateOccupied;
