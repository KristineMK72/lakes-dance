"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/login?message=Supabase is not configured yet. Add your environment variables in Vercel.");
  }

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/signup?message=Supabase is not configured yet. Add your environment variables in Vercel.");
  }

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
      },
    },
  };

  const { data: signupData, error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/signup?message=Could not create account");
  }

  // If email confirmation is off, Supabase returns a session immediately
  if (signupData.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  // Otherwise fall back to the email confirmation message
  revalidatePath("/", "layout");
  redirect("/login?message=Check email to continue sign in process");
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
