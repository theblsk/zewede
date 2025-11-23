"use server";

import { CategoryInsertType } from "@/types/derived";
import { createClient } from "@/utils/supabase/server";

export const createCategory = async (input: CategoryInsertType) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").insert(input);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
