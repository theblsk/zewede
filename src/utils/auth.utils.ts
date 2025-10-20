import { UsersRowType } from "@/types/derived";
import { createClient } from "./supabase/server";

export const checkUserOnboarded = async (): Promise<UsersRowType | null> => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user ? user.id : null;
    const { data: userData } = await supabase.from('users').select('*').eq('id', userId).single<UsersRowType>();
    return userData;
};
