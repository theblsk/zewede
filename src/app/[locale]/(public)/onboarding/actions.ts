"use server";

import { FormInput, formSchema } from "@/app/config/onboard-form.config";
import { createClient } from "@/utils/supabase/server";
import { UsersRowType } from "@/types/derived";

export async function onboarding(formData: FormInput) {
  try {
    const validatedData = formSchema.parse(formData);
    const { country_code, phone_number, ...rest } = validatedData;
    const transformedData = {
      ...rest,
      phone_number: `${country_code}${phone_number}`,
    }
    const supabase = await createClient();
    const  {error, data} = await supabase.from('users').insert(transformedData).select().single<UsersRowType>();
    if (error) {
      console.error("Error inserting user:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data) {
      console.error("No data returned from insert");
      return {
        success: false,
        error: "No data returned from insert",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
