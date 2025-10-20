import { Database } from "./supabase";

export type UsersRowType = Database['public']['Tables']['users']['Row'];