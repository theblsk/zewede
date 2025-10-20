"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

type AuthIntent = "login" | "signup";

export async function login(formData: FormData) {
  const locale = await getLocale();
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(`/${locale}/error`);
  }

  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}`);
}

export async function authenticate(formData: FormData) {
  const intent = formData.get("intent") as AuthIntent | null;

  if (!intent) {
    throw new Error("Missing auth intent");
  }

  switch (intent) {
    case "login": {
      return login(formData);
    }
    case "signup": {
      return signup(formData);
    }
    default: {
      throw new Error(`Unsupported auth intent: ${intent}`);
    }
  }
}

export async function signup(formData: FormData) {
  const locale = await getLocale();
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect(`/${locale}/error`);
  }

  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}`);
}

export async function logout() {
  const locale = await getLocale();
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}`);
}
