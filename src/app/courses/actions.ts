"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function simulatePurchase(courseId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const { error } = await supabase.from("user_courses").insert({
    course_id: courseId,
    user_id: user.id,
  });

  if (error) {
    console.error("Error simulating purchase:", error);
    return { error: "Could not complete the simulated purchase." };
  }

  revalidatePath("/courses");
  return { success: true };
}
