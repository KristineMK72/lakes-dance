"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createEvent(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/post?message=Supabase is not configured yet. Add your environment variables in Vercel.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const address = formData.get("address") as string;
  const start_time = formData.get("start_time") as string;
  const dance_style = formData.get("dance_style") as string;

  const fullLocation = address ? `${location || ""}${location && address ? " — " : ""}${address}` : location;

  const { error } = await supabase.from("lakes_events").insert({
    user_id: user.id,
    title,
    description,
    location: fullLocation,
    start_time: new Date(start_time).toISOString(),
    dance_style,
  });

  if (error) {
    console.error(error);
    redirect("/post?message=Could not create event");
  }

  revalidatePath("/");
  revalidatePath("/calendar");
  redirect("/");
}

export async function deleteEvent(formData: FormData) {
  const eventId = formData.get("event_id") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("lakes_events").delete().eq("id", eventId).eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath("/calendar");
}
