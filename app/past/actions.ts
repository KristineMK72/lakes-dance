"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function uploadEventPhoto(formData: FormData) {
  const eventId = formData.get("event_id") as string;
  const caption = formData.get("caption") as string;
  const file = formData.get("photo") as File | null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Sign in to add photos");
  }

  if (!file || file.size === 0) {
    redirect("/past?message=Please choose a photo");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/events/${eventId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("lakes-images")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    console.error(uploadError);
    redirect("/past?message=Upload failed");
  }

  const { data } = supabase.storage.from("lakes-images").getPublicUrl(path);

  await supabase.from("lakes_event_photos").insert({
    event_id: eventId,
    user_id: user.id,
    photo_url: data.publicUrl,
    caption: caption || null,
  });

  // Also share to the wall
  await supabase.from("lakes_wall_posts").insert({
    author_id: user.id,
    wall_user_id: user.id,
    content: caption || "Shared a photo from a past dance",
    image_url: data.publicUrl,
  });

  revalidatePath("/past");
  revalidatePath("/wall");
  redirect("/past");
}
