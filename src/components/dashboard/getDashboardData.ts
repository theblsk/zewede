import { createClient } from '@/utils/supabase/server';

import { MenuItemWithRelations } from '@/types/derived';

type DashboardCategory = {
  id: string;
  name: string;
  is_active: boolean;
  description: string | null;
  // Optional Arabic translations for convenience in forms
  name_ar?: string | null;
  description_ar?: string | null;
  menu_items: MenuItemWithRelations[];
};

type DashboardData = {
  categories: DashboardCategory[];
  searchItems: MenuItemWithRelations[];
};

export const getDashboardData = async (): Promise<DashboardData> => {
  const supabase = await createClient();

  const { data: categoriesData } = await supabase
    .from('categories')
    .select(
      `id, name, is_active, description,
       categories_translations(locale, name, description),
       menu_items(*, menu_item_price(*), menu_items_translations(locale, name, description))`
    )
    .order('name', { ascending: true });

  type Translation = { locale: string; name: string; description: string | null };
  type ItemWithTranslations = MenuItemWithRelations & { menu_items_translations?: Translation[] };

  const categories: DashboardCategory[] = (categoriesData ?? []).map((category) => {
    const arCat = (category as unknown as {
      categories_translations?: Translation[];
    }).categories_translations?.find((t) => t.locale === 'ar');

    const mappedItems: MenuItemWithRelations[] = (category.menu_items ?? []).map((item: ItemWithTranslations) => {
      const arItem = item.menu_items_translations?.find((t) => t.locale === 'ar');
      return {
        ...item,
        name_ar: arItem?.name ?? null,
        description_ar: arItem?.description ?? null,
      } as MenuItemWithRelations;
    });

    return {
      id: category.id,
      name: category.name,
      is_active: category.is_active,
      description: category.description,
      name_ar: arCat?.name ?? null,
      description_ar: arCat?.description ?? null,
      menu_items: mappedItems,
    } as DashboardCategory;
  });

  return {
    categories,
    searchItems: categories.flatMap((category) => category.menu_items),
  };
};

export const getMenuItemById = async (itemId: string): Promise<MenuItemWithRelations | null> => {
  const supabase = await createClient();

  const { data: itemData } = await supabase
    .from('menu_items')
    .select(
      `*, 
       category:categories(id, name),
       menu_item_price(*), 
       menu_items_translations(locale, name, description)`
    )
    .eq('id', itemId)
    .maybeSingle();

  if (!itemData) {
    return null;
  }

  type Translation = { locale: string; name: string; description: string | null };
  type ItemWithTranslations = MenuItemWithRelations & { menu_items_translations?: Translation[] };

  const arItem = (itemData as unknown as ItemWithTranslations).menu_items_translations?.find(
    (t) => t.locale === 'ar'
  );

  return {
    ...itemData,
    name_ar: arItem?.name ?? null,
    description_ar: arItem?.description ?? null,
  } as MenuItemWithRelations;
};


