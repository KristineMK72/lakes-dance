"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function postToWall(formData: FormData) {
  const content = formData.get("content") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Sign in to post");
  }

  await supabase.from("lakes_wall_posts").insert({
    author_id: user.id,
    wall_user_id: user.id,
    content,
  });

  revalidatePath("/wall");
}
