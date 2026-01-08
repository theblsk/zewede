import type { SupabaseClient } from '@supabase/supabase-js';

import type { MenuItemRowType, MenuItemSizeRowType, MenuItemSizeTranslationRowType } from '@/types/derived';
import type { Database } from '@/types/supabase';

type SupabaseServerClient = SupabaseClient<Database>;

type Translation = {
  locale: string;
  name: string;
  description?: string | null;
};

type CategoryTranslation = {
  locale: string;
  name: string; 
};

type SizeWithTranslations = MenuItemSizeRowType & {
  menu_item_size_translations?: MenuItemSizeTranslationRowType[];
};

type MenuItemQueryResult = MenuItemRowType & {
  menu_items_translations?: Translation[];
  menu_item_sizes?: SizeWithTranslations[];
  category?: {
    id: string;
    name: string;
    categories_translations?: CategoryTranslation[];
  } | null;
};

export type PublicMenuItem = {
  id: string;
  name: string;
  description: string | null;
  availability: MenuItemRowType['availability'];
  sizes: Array<{
    name: string;
    price: number;
  }>;
  imageKey: MenuItemRowType['image_key'];
  categoryName: string | null;
  categoryId: string | null;
};

type GetPublicMenuItemsArgs = {
  supabase: SupabaseServerClient;
  locale: string;
  limit?: number;
};

export async function getPublicMenuItems({
  supabase,
  locale,
  limit = 9,
}: GetPublicMenuItemsArgs): Promise<PublicMenuItem[]> {
  const { data } = await supabase
    .from('menu_items')
    .select(`
      id,
      name,
      description,
      availability,
      image_key,
      menu_items_translations(locale, name, description),
      menu_item_sizes(
        id,
        price,
        is_active,
        menu_item_size_translations(locale, name)
      ),
      category:categories(
        id,
        name,
        categories_translations(locale, name)
      )
    `)
    .eq('is_active', true)
    .limit(limit);

  const typedItems = (data ?? []) as unknown as MenuItemQueryResult[];

  return typedItems.map((item) => {
    const itemTranslation =
      locale === 'ar'
        ? item.menu_items_translations?.find((translation) => translation.locale === 'ar')
        : undefined;

    const categoryTranslation =
      locale === 'ar'
        ? item.category?.categories_translations?.find((translation) => translation.locale === 'ar')
        : undefined;

    const sizes = (item.menu_item_sizes ?? [])
      .filter((size) => size.is_active)
      .map((size) => {
        const sizeTranslation = size.menu_item_size_translations?.find(
          (t) => t.locale === locale
        ) ?? size.menu_item_size_translations?.find((t) => t.locale === 'en');
        return {
          name: sizeTranslation?.name ?? '',
          price: size.price,
        };
      });

    return {
      id: item.id,
      name: itemTranslation?.name ?? item.name,
      description: itemTranslation?.description ?? item.description,
      availability: item.availability,
      sizes,
      imageKey: item.image_key,
      categoryName: categoryTranslation?.name ?? item.category?.name ?? null,
      categoryId: item.category?.id ?? null,
    };
  });
}

