import { Database } from "./supabase";

export type UsersRowType = Database["public"]["Tables"]["users"]["Row"];
export type CategoryRowType = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsertType = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdateType = Database["public"]["Tables"]["categories"]["Update"];
export type MenuItemRowType = Database["public"]["Tables"]["menu_items"]["Row"];
export type MenuItemInsertType = Database["public"]["Tables"]["menu_items"]["Insert"];
export type MenuItemUpdateType = Database["public"]["Tables"]["menu_items"]["Update"];
export type SiteSettingsRowType = Database["public"]["Tables"]["site_settings"]["Row"];
export type SiteSettingsInsertType = Database["public"]["Tables"]["site_settings"]["Insert"];
export type SiteSettingsUpdateType = Database["public"]["Tables"]["site_settings"]["Update"];
// Legacy types - kept for backward compatibility during migration
export type MenuItemPriceRowType = Database["public"]["Tables"]["menu_item_price"]["Row"] | undefined;
export type MenuItemPriceInsertType = Database["public"]["Tables"]["menu_item_price"]["Insert"] | undefined;
export type MenuItemPriceUpdateType = Database["public"]["Tables"]["menu_item_price"]["Update"] | undefined;
export type MenuItemMaxOrderLimitRowType = Database["public"]["Tables"]["menu_item_max_order_limits"]["Row"] | undefined;
export type MenuItemMaxOrderLimitInsertType = Database["public"]["Tables"]["menu_item_max_order_limits"]["Insert"] | undefined;
export type MenuItemMaxOrderLimitUpdateType = Database["public"]["Tables"]["menu_item_max_order_limits"]["Update"] | undefined;

// New types for menu item sizes
export type MenuItemSizeRowType = {
  id: string;
  menu_item_id: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItemSizeInsertType = {
  id?: string;
  menu_item_id: string;
  price: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type MenuItemSizeUpdateType = {
  id?: string;
  menu_item_id?: string;
  price?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type MenuItemSizeTranslationRowType = {
  id: string;
  menu_item_size_id: string;
  locale: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type MenuItemSizeTranslationInsertType = {
  id?: string;
  menu_item_size_id: string;
  locale: string;
  name: string;
  created_at?: string;
  updated_at?: string;
};

export type MenuItemWithRelations = MenuItemRowType & {
  category: Pick<CategoryRowType, "id" | "name"> | null;
  menu_item_sizes?: (MenuItemSizeRowType & {
    menu_item_size_translations?: MenuItemSizeTranslationRowType[];
  })[];
  // Optional denormalized Arabic translation fields for dashboard editing convenience
  name_ar?: string | null;
  description_ar?: string | null;
};
