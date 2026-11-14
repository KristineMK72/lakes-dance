"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBand(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/bands/new?message=Supabase is not configured yet.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("lakes_bands").insert({
    user_id: user.id,
    name: formData.get("name") as string,
    genre: formData.get("genre") as string,
    website: formData.get("website") as string,
    description: formData.get("description") as string,
  });

  if (error) {
    console.error(error);
    redirect("/bands/new?message=Could not save band");
  }

  revalidatePath("/bands");
  redirect("/bands");
}
