"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function postToWall(formData: FormData) {
  const content = formData.get("content") as string;
  let imageUrl = formData.get("image_url") as string;
  const file = formData.get("image_file") as File | null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Sign in to post");
  }

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/wall/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("lakes-images")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (!uploadError) {
      const { data } = supabase.storage.from("lakes-images").getPublicUrl(path);
      imageUrl = data.publicUrl;
    }
  }

  await supabase.from("lakes_wall_posts").insert({
    author_id: user.id,
    wall_user_id: user.id,
    content,
    image_url: imageUrl || null,
  });

  revalidatePath("/wall");
}
