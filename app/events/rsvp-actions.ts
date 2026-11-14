"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function rsvp(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/?message=Supabase is not configured yet.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event_id = formData.get("event_id") as string;
  const status = (formData.get("status") as string) || "going";

  const { error } = await supabase.from("lakes_rsvps").upsert({
    event_id,
    user_id: user.id,
    status,
  }, { onConflict: "event_id,user_id" });

  if (error) console.error(error);

  revalidatePath("/");
  revalidatePath("/calendar");
  redirect("/");
}
