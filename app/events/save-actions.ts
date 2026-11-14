"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function saveEvent(formData: FormData) {
  const eventId = formData.get("event_id") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Sign in to save events");
  }

  await supabase.from("lakes_saved_events").insert({
    event_id: eventId,
    user_id: user.id,
  });

  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function unsaveEvent(formData: FormData) {
  const eventId = formData.get("event_id") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("lakes_saved_events").delete().eq("event_id", eventId).eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath("/calendar");
}
