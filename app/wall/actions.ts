"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function postToWall(formData: FormData) {
  const content = formData.get("content") as string;
  let mediaUrl = formData.get("image_url") as string;
  const file = formData.get("image_file") as File | null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Sign in to post");
  }

  await supabase.from("lakes_profiles").upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Dancer",
  }, { onConflict: "id" });

  if (file && file.size > 0) {
    // Soft limit — warn on very large files
    if (file.size > 50 * 1024 * 1024) {
      redirect("/wall?message=" + encodeURIComponent("File is too large. Try a smaller video (under 50 MB)."));
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/wall/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("lakes-images")
      .upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      redirect("/wall?message=" + encodeURIComponent("Upload failed: " + (uploadError.message || "unknown error")));
    }

    const { data } = supabase.storage.from("lakes-images").getPublicUrl(path);
    mediaUrl = data.publicUrl;
  }

  const { error } = await supabase.from("lakes_wall_posts").insert({
    author_id: user.id,
    wall_user_id: user.id,
    content,
    image_url: mediaUrl || null,
  });

  if (error) {
    console.error("Wall post error:", error);
    redirect("/wall?message=" + encodeURIComponent(error.message || "Could not post"));
  }

  revalidatePath("/wall");
  revalidatePath("/profile");
  revalidatePath(`/profile/${user.id}`);
  redirect("/wall");
}

export async function deleteWallPost(formData: FormData) {
  const postId = formData.get("post_id") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("lakes_wall_posts").delete().eq("id", postId).eq("author_id", user.id);

  revalidatePath("/wall");
  revalidatePath("/profile");
  revalidatePath(`/profile/${user.id}`);
}
