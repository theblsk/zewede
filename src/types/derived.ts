import { Database } from "./supabase";

export type UsersRowType = Database["public"]["Tables"]["users"]["Row"];
export type CategoryRowType = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsertType = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdateType = Database["public"]["Tables"]["categories"]["Update"];
export type MenuItemRowType = Database["public"]["Tables"]["menu_items"]["Row"];
export type MenuItemInsertType = Database["public"]["Tables"]["menu_items"]["Insert"];
export type MenuItemUpdateType = Database["public"]["Tables"]["menu_items"]["Update"];
export type MenuItemPriceRowType = Database["public"]["Tables"]["menu_item_price"]["Row"];
export type MenuItemPriceInsertType = Database["public"]["Tables"]["menu_item_price"]["Insert"];
export type MenuItemPriceUpdateType = Database["public"]["Tables"]["menu_item_price"]["Update"];
export type MenuItemMaxOrderLimitRowType = Database["public"]["Tables"]["menu_item_max_order_limits"]["Row"];
export type MenuItemMaxOrderLimitInsertType = Database["public"]["Tables"]["menu_item_max_order_limits"]["Insert"];
export type MenuItemMaxOrderLimitUpdateType = Database["public"]["Tables"]["menu_item_max_order_limits"]["Update"];

export type MenuItemWithRelations = MenuItemRowType & {
  category: Pick<CategoryRowType, "id" | "name"> | null;
  menu_item_price: MenuItemPriceRowType[];
  menu_item_max_order_limits?: MenuItemMaxOrderLimitRowType[];
  // Optional denormalized Arabic translation fields for dashboard editing convenience
  name_ar?: string | null;
  description_ar?: string | null;
};