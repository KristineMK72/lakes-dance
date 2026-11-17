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

  let avatarUrl = formData.get("avatar_url") as string;
  const avatarFile = formData.get("avatar_file") as File | null;

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("lakes-images")
      .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (!uploadError) {
      const { data } = supabase.storage.from("lakes-images").getPublicUrl(path);
      avatarUrl = data.publicUrl;
    }
  }

  let coverUrl = formData.get("cover_url") as string;
  const coverFile = formData.get("cover_file") as File | null;

  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split(".").pop() || "jpg";
    const path = `${user.id}/cover.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("lakes-images")
      .upload(path, coverFile, { upsert: true, contentType: coverFile.type });

    if (!uploadError) {
      const { data } = supabase.storage.from("lakes-images").getPublicUrl(path);
      coverUrl = data.publicUrl;
    }
  }

  const { error } = await supabase.from("lakes_profiles").update({
    full_name: formData.get("full_name") as string,
    bio: formData.get("bio") as string,
    avatar_url: avatarUrl || null,
    cover_url: coverUrl || null,
  }).eq("id", user.id);

  if (error) console.error(error);

  revalidatePath("/profile");
  revalidatePath(`/profile/${user.id}`);
  redirect("/profile");
}
