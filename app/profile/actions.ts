"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/profile?message=Supabase is not configured yet.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("lakes_profiles").update({
    full_name: formData.get("full_name") as string,
    bio: formData.get("bio") as string,
    avatar_url: formData.get("avatar_url") as string,
  }).eq("id", user.id);

  if (error) console.error(error);

  revalidatePath("/profile");
  redirect("/profile");
}
