'use server';

import { revalidatePath } from 'next/cache';
import { getLocale } from 'next-intl/server';

import { checkUserOnboarded } from '@/utils/auth.utils';
import { createClient } from '@/utils/supabase/server';

import { z } from 'zod';

import {
  CategoryInsertType,
  CategoryUpdateType,
  MenuItemInsertType,
  MenuItemMaxOrderLimitInsertType,
  MenuItemPriceInsertType,
  MenuItemRowType,
  MenuItemUpdateType,
  MenuItemWithRelations,
} from '@/types/derived';
import type { Database } from '@/types/supabase';
import {
  categoryServerSchema,
  type CategoryFormInput,
} from '@/validators/category';
import {
  menuItemServerSchema,
  type MenuItemFormInput,
} from '@/validators/menu-item';

type ActionResponse<Data = undefined> = {
  ok: boolean;
  message: string;
  data?: Data;
};

type SearchState = {
  query: string;
  results: Array<
    MenuItemRowType & {
      category_name: string | null;
    }
  >;
};

const ensureStaff = async () => {
  const user = await checkUserOnboarded();

  if (!user) {
    throw new Error('Unauthorized');
  }

  switch (user.role) {
    case 'ADMIN':
    case 'MANAGER':
      return user;
    default:
      throw new Error('Unauthorized');
  }
};

const resolveLocale = async (formLocale?: unknown) => {
  if (typeof formLocale === 'string' && formLocale.length > 0) {
    return formLocale;
  }

  return getLocale();
};

function slugify(value: string) {
  return value.normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .toLowerCase()
      .replace(/\s+/g, '-') // spaces to dashes
      .replace(/&/g, '-and-') // ampersand to and
      .replace(/[^\w\-]+/g, '') // remove non-words
      .replace(/\-\-+/g, '-') // collapse multiple dashes
      .replace(/^-+/, '') // trim starting dash
      .replace(/-+$/, ''); // trim ending dash
}


const menuItemSchema = z.object({
  categoryId: z.uuid(),
  name: z.string().min(1),
  description: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val : null)),
  availability: z
    .any()
    .optional()
    .transform((val) => val === 'on' || val === true || val === 'true'),
  isActive: z
    .any()
    .optional()
    .transform((val) => val === 'on' || val === true || val === 'true'),
  imageKey: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val : null)),
});

const menuItemPriceSchema = z.object({
  menuItemId: z.uuid(),
  type: z.enum(['gram', 'box']),
  count: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().positive()),
  price: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z.number().int().nonnegative()),
});

// Category schema for validation (legacy - for FormData-based actions)
// Uses server schema for validation
const categorySchema = categoryServerSchema;

const buildCategoryPayload = (parsed: z.infer<typeof categorySchema>): CategoryInsertType => ({
  name: parsed.name,
  description: parsed.description ?? null,
  is_active: parsed.isActive,
  slug: slugify(parsed.name),
});

export const createCategory = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));
  const supabase = await createClient();

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    isActive: formData.get('is_active'),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid category data.' };
  }

  const payload: CategoryInsertType = {
    ...buildCategoryPayload(parsed.data),
  };

  const { data: createdCategory, error } = await supabase
    .from('categories')
    .insert(payload)
    .select('id')
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  // Optional Arabic translation upsert
  const nameAr = String(formData.get('name_ar') ?? '').trim();
  const descArRaw = String(formData.get('description_ar') ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (createdCategory?.id && nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['categories_translations']['Insert'] = {
      category_id: createdCategory.id,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('categories_translations').upsert(translationPayload, {
      onConflict: 'category_id,locale',
    });
  }

  await revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: 'Category created successfully.' };
};

export const updateCategory = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));
  const categoryId = formData.get('id');

  if (typeof categoryId !== 'string') {
    return { ok: false, message: 'Missing category identifier.' };
  }

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    isActive: formData.get('is_active'),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid category data.' };
  }

  const payload: CategoryUpdateType = {
    name: parsed.data.name,
    description: parsed.data.description,
    is_active: parsed.data.isActive,
    slug: slugify(parsed.data.name),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', categoryId);

  if (error) {
    return { ok: false, message: error.message };
  }

  // Optional Arabic translation upsert
  const nameAr = String(formData.get('name_ar') ?? '').trim();
  const descArRaw = String(formData.get('description_ar') ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (typeof categoryId === 'string' && nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['categories_translations']['Insert'] = {
      category_id: categoryId,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('categories_translations').upsert(translationPayload, {
      onConflict: 'category_id,locale',
    });
  }

  await revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: 'Category updated successfully.' };
};

export const deleteCategory = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));
  const categoryId = formData.get('id');

  if (typeof categoryId !== 'string') {
    return { ok: false, message: 'Missing category identifier.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  if (error) {
    return { ok: false, message: error.message };
  }

  await revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: 'Category removed.' };
};

export const createMenuItem = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));

  const parsed = menuItemSchema.safeParse({
    categoryId: formData.get('category_id'),
    name: formData.get('name'),
    description: formData.get('description'),
    availability: formData.get('availability'),
    isActive: formData.get('is_active'),
    imageKey: formData.get('image_key'),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid menu item data.' };
  }

  const payload: MenuItemInsertType = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    description: parsed.data.description,
    availability: parsed.data.availability,
    is_active: parsed.data.isActive,
    slug: slugify(parsed.data.name),
    image_key: parsed.data.imageKey,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('menu_items')
    .insert(payload)
    .select('id')
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  // Handle max order limit if provided
  const maxOrderLimitUnit = formData.get('max_order_limit_unit');
  const maxOrderLimitValue = formData.get('max_order_limit_value');
  if (data?.id && maxOrderLimitUnit && maxOrderLimitValue) {
    const limitValue = Number.parseInt(String(maxOrderLimitValue), 10);
    if (!Number.isNaN(limitValue) && limitValue > 0) {
      await supabase.from('menu_item_max_order_limits').upsert({
        menu_item_id: data.id,
        unit: maxOrderLimitUnit as 'box' | 'gram',
        limit_value: limitValue,
      }, {
        onConflict: 'menu_item_id,unit',
      });
    }
  }

  const priceFieldsPresent = ['price_type', 'price_count', 'price_amount'].every((field) =>
    Boolean(formData.get(field)),
  );

  if (priceFieldsPresent && data?.id) {
    const pricePayload = menuItemPriceSchema.safeParse({
      menuItemId: data.id,
      type: formData.get('price_type'),
      count: formData.get('price_count'),
      price: formData.get('price_amount'),
    });

    if (pricePayload.success) {
      await supabase.from('menu_item_price').insert({
        menu_item_id: pricePayload.data.menuItemId,
        type: pricePayload.data.type,
        count: pricePayload.data.count,
        price: pricePayload.data.price,
      } satisfies MenuItemPriceInsertType);
    }
  }

  // Optional Arabic translation upsert
  const nameAr = String(formData.get('name_ar') ?? '').trim();
  const descArRaw = String(formData.get('description_ar') ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (data?.id && nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['menu_items_translations']['Insert'] = {
      menu_item_id: data.id,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('menu_items_translations').upsert(translationPayload, {
      onConflict: 'menu_item_id,locale',
    });
  }

  await revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: 'Menu item created successfully.' };
};

export const updateMenuItem = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));
  const itemId = formData.get('id');

  if (typeof itemId !== 'string') {
    return { ok: false, message: 'Missing menu item identifier.' };
  }

  const parsed = menuItemSchema.safeParse({
    categoryId: formData.get('category_id'),
    name: formData.get('name'),
    description: formData.get('description'),
    availability: formData.get('availability'),
    isActive: formData.get('is_active'),
    imageKey: formData.get('image_key'),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid menu item data.' };
  }

  const payload: MenuItemUpdateType = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    description: parsed.data.description,
    availability: parsed.data.availability,
    is_active: parsed.data.isActive,
    slug: slugify(parsed.data.name),
    image_key: parsed.data.imageKey,
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from('menu_items')
    .update(payload)
    .eq('id', itemId);

  if (error) {
    return { ok: false, message: error.message };
  }

  // Handle max order limit if provided
  const maxOrderLimitUnit = formData.get('max_order_limit_unit');
  const maxOrderLimitValue = formData.get('max_order_limit_value');
  if (maxOrderLimitUnit && maxOrderLimitValue) {
    const limitValue = Number.parseInt(String(maxOrderLimitValue), 10);
    if (!Number.isNaN(limitValue) && limitValue > 0) {
      await supabase.from('menu_item_max_order_limits').upsert({
        menu_item_id: itemId,
        unit: maxOrderLimitUnit as 'box' | 'gram',
        limit_value: limitValue,
      }, {
        onConflict: 'menu_item_id,unit',
      });
    }
  }

  const priceId = formData.get('price_id');
  const priceAction = formData.get('price_action');

  switch (priceAction) {
    case 'upsert': {
      const pricePayload = menuItemPriceSchema.safeParse({
        menuItemId: itemId,
        type: formData.get('price_type'),
        count: formData.get('price_count'),
        price: formData.get('price_amount'),
      });

      if (pricePayload.success) {
        const upsertPayload: MenuItemPriceInsertType = {
          menu_item_id: pricePayload.data.menuItemId,
          type: pricePayload.data.type,
          count: pricePayload.data.count,
          price: pricePayload.data.price,
        };

        await supabase.from('menu_item_price').upsert(upsertPayload, {
          onConflict: 'menu_item_id,type',
        });
      }
      break;
    }
    case 'delete': {
      if (typeof priceId === 'string' && priceId.length > 0) {
        await supabase.from('menu_item_price').delete().eq('id', priceId);
      }
      break;
    }
    default:
      break;
  }

  // Optional Arabic translation upsert
  const nameAr = String(formData.get('name_ar') ?? '').trim();
  const descArRaw = String(formData.get('description_ar') ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (typeof itemId === 'string' && nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['menu_items_translations']['Insert'] = {
      menu_item_id: itemId,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('menu_items_translations').upsert(translationPayload, {
      onConflict: 'menu_item_id,locale',
    });
  }

  await revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: 'Menu item updated successfully.' };
};

export const deleteMenuItem = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));
  const itemId = formData.get('id');

  if (typeof itemId !== 'string') {
    return { ok: false, message: 'Missing menu item identifier.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('menu_items').delete().eq('id', itemId);

  if (error) {
    return { ok: false, message: error.message };
  }

  await revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: 'Menu item removed.' };
};

export const toggleCategoryActive = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));
  const categoryId = formData.get('id');
  const isActive = formData.get('is_active') === 'true';

  if (typeof categoryId !== 'string') {
    return { ok: false, message: 'Missing category identifier.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', categoryId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: isActive ? 'Category activated.' : 'Category deactivated.' };
};

export const toggleMenuItemActive = async (formData: FormData): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(formData.get('locale'));
  const itemId = formData.get('id');
  const isActive = formData.get('is_active') === 'true';

  if (typeof itemId !== 'string') {
    return { ok: false, message: 'Missing menu item identifier.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('menu_items')
    .update({ is_active: isActive })
    .eq('id', itemId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/${locale}/dashboard`, 'page');
  return { ok: true, message: isActive ? 'Menu item activated.' : 'Menu item deactivated.' };
};

export const searchMenuItems = async (
  _prevState: SearchState,
  formData: FormData,
): Promise<SearchState> => {
  await ensureStaff();
  const query = String(formData.get('query') ?? '').trim();

  if (query.length === 0) {
    return { query: '', results: [] };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('menu_items')
    .select(
      `*, categories(name), menu_item_price(*)`
    )
    .ilike('name', `%${query}%`)
    .limit(20);

  if (error) {
    return { query, results: [] };
  }

  const mapped = (data ?? []).map((item) => ({
    ...item,
    category_name: (item as { categories?: { name?: string } }).categories?.name ?? null,
  }));

  return {
    query,
    results: mapped as SearchState['results'],
  };
};

// New server actions that accept plain objects (for TanStack Form)
export const createCategoryFromValues = async (
  input: CategoryFormInput & { locale?: string }
): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(input.locale);
  const supabase = await createClient();

  const parsed = categoryServerSchema.safeParse({
    name: input.name,
    description: input.description,
    isActive: input.is_active,
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid category data.' };
  }

  const payload: CategoryInsertType = {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    is_active: parsed.data.isActive,
    slug: slugify(parsed.data.name),
  };

  const { data: createdCategory, error } = await supabase
    .from('categories')
    .insert(payload)
    .select('id')
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  // Optional Arabic translation upsert
  const nameAr = (input.name_ar ?? '').trim();
  const descArRaw = (input.description_ar ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (createdCategory?.id && nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['categories_translations']['Insert'] = {
      category_id: createdCategory.id,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('categories_translations').upsert(translationPayload, {
      onConflict: 'category_id,locale',
    });
  }

  revalidatePath(`/${locale}/dashboard`);
  return { ok: true, message: 'Category created successfully.' };
};

export const updateCategoryFromValues = async (
  categoryId: string,
  input: CategoryFormInput & { locale?: string }
): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(input.locale);

  const parsed = categoryServerSchema.safeParse({
    name: input.name,
    description: input.description,
    isActive: input.is_active,
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid category data.' };
  }

  const payload: CategoryUpdateType = {
    name: parsed.data.name,
    description: parsed.data.description,
    is_active: parsed.data.isActive,
    slug: slugify(parsed.data.name),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', categoryId);

  if (error) {
    return { ok: false, message: error.message };
  }

  // Optional Arabic translation upsert
  const nameAr = (input.name_ar ?? '').trim();
  const descArRaw = (input.description_ar ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['categories_translations']['Insert'] = {
      category_id: categoryId,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('categories_translations').upsert(translationPayload, {
      onConflict: 'category_id,locale',
    });
  }

  revalidatePath(`/${locale}/dashboard`);
  return { ok: true, message: 'Category updated successfully.' };
};

// Void-return wrappers for form actions (keep for backward compatibility)
export const createCategoryAction = async (formData: FormData): Promise<void> => {
  await createCategory(formData);
};

export const updateCategoryAction = async (formData: FormData): Promise<void> => {
  await updateCategory(formData);
};

export const createMenuItemAction = async (formData: FormData): Promise<void> => {
  await createMenuItem(formData);
};

export const updateMenuItemAction = async (formData: FormData): Promise<void> => {
  await updateMenuItem(formData);
};

// New server actions that accept plain objects (for TanStack Form)
export const createMenuItemFromValues = async (
  input: MenuItemFormInput & { locale?: string }
): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(input.locale);
  const supabase = await createClient();

  const parsed = menuItemServerSchema.safeParse({
    categoryId: input.category_id,
    name: input.name,
    description: input.description,
    availability: input.availability,
    isActive: input.is_active,
    maxOrderLimitUnit: input.max_order_limit_unit,
    maxOrderLimitValue: input.max_order_limit_value ? String(input.max_order_limit_value) : undefined,
    imageKey: input.image_key,
    priceType: input.price_type,
    priceCount: String(input.price_count),
    priceAmount: String(input.price_amount),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid menu item data.' };
  }

  const payload: MenuItemInsertType = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    description: parsed.data.description,
    availability: parsed.data.availability,
    is_active: parsed.data.isActive,
    slug: slugify(parsed.data.name),
    image_key: parsed.data.imageKey,
  };

  const { data: createdItem, error } = await supabase
    .from('menu_items')
    .insert(payload)
    .select('id')
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  // Insert max order limit if provided
  if (createdItem?.id && parsed.data.maxOrderLimitUnit && parsed.data.maxOrderLimitValue) {
    const limitPayload: MenuItemMaxOrderLimitInsertType = {
      menu_item_id: createdItem.id,
      unit: parsed.data.maxOrderLimitUnit,
      limit_value: parsed.data.maxOrderLimitValue,
    };
    await supabase.from('menu_item_max_order_limits').upsert(limitPayload, {
      onConflict: 'menu_item_id,unit',
    });
  }

  // Insert price
  if (createdItem?.id) {
    const pricePayload: MenuItemPriceInsertType = {
      menu_item_id: createdItem.id,
      type: parsed.data.priceType,
      count: parsed.data.priceCount,
      price: parsed.data.priceAmount,
    };
    await supabase.from('menu_item_price').insert(pricePayload);
  }

  // Optional Arabic translation upsert
  const nameAr = (input.name_ar ?? '').trim();
  const descArRaw = (input.description_ar ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (createdItem?.id && nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['menu_items_translations']['Insert'] = {
      menu_item_id: createdItem.id,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('menu_items_translations').upsert(translationPayload, {
      onConflict: 'menu_item_id,locale',
    });
  }

  revalidatePath(`/${locale}/dashboard`);
  return { ok: true, message: 'Menu item created successfully.' };
};

export const updateMenuItemFromValues = async (
  itemId: string,
  input: MenuItemFormInput & { locale?: string }
): Promise<ActionResponse> => {
  await ensureStaff();
  const locale = await resolveLocale(input.locale);
  const supabase = await createClient();

  const parsed = menuItemServerSchema.safeParse({
    categoryId: input.category_id,
    name: input.name,
    description: input.description,
    availability: input.availability,
    isActive: input.is_active,
    maxOrderLimitUnit: input.max_order_limit_unit,
    maxOrderLimitValue: input.max_order_limit_value ? String(input.max_order_limit_value) : undefined,
    imageKey: input.image_key,
    priceType: input.price_type,
    priceCount: String(input.price_count),
    priceAmount: String(input.price_amount),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Invalid menu item data.' };
  }

  const payload: MenuItemUpdateType = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    description: parsed.data.description,
    availability: parsed.data.availability,
    is_active: parsed.data.isActive,
    slug: slugify(parsed.data.name),
    image_key: parsed.data.imageKey,
  };

  const { error } = await supabase
    .from('menu_items')
    .update(payload)
    .eq('id', itemId);

  if (error) {
    return { ok: false, message: error.message };
  }

  // Upsert max order limit if provided
  if (parsed.data.maxOrderLimitUnit && parsed.data.maxOrderLimitValue) {
    const limitPayload: MenuItemMaxOrderLimitInsertType = {
      menu_item_id: itemId,
      unit: parsed.data.maxOrderLimitUnit,
      limit_value: parsed.data.maxOrderLimitValue,
    };
    await supabase.from('menu_item_max_order_limits').upsert(limitPayload, {
      onConflict: 'menu_item_id,unit',
    });
  }

  // Upsert price
  const pricePayload: MenuItemPriceInsertType = {
    menu_item_id: itemId,
    type: parsed.data.priceType,
    count: parsed.data.priceCount,
    price: parsed.data.priceAmount,
  };
  await supabase.from('menu_item_price').upsert(pricePayload, {
    onConflict: 'menu_item_id,type',
  });

  // Optional Arabic translation upsert
  const nameAr = (input.name_ar ?? '').trim();
  const descArRaw = (input.description_ar ?? '').trim();
  const descAr = descArRaw.length > 0 ? descArRaw : null;

  if (nameAr.length > 0) {
    const translationPayload: Database['public']['Tables']['menu_items_translations']['Insert'] = {
      menu_item_id: itemId,
      locale: 'ar',
      name: nameAr,
      description: descAr,
    };
    await supabase.from('menu_items_translations').upsert(translationPayload, {
      onConflict: 'menu_item_id,locale',
    });
  }

  revalidatePath(`/${locale}/dashboard`);
  return { ok: true, message: 'Menu item updated successfully.' };
};

export const deleteMenuItemFromValues = async (
  itemId: string,
  locale?: string
): Promise<ActionResponse> => {
  await ensureStaff();
  const resolvedLocale = await resolveLocale(locale);
  const supabase = await createClient();

  const { error } = await supabase.from('menu_items').delete().eq('id', itemId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/${resolvedLocale}/dashboard`);
  return { ok: true, message: 'Menu item removed.' };
};

// Fetch helpers for React Query
export const getCategoriesForDashboard = async () => {
  await ensureStaff();
  const supabase = await createClient();

  const { data: categoriesData } = await supabase
    .from('categories')
    .select(
      `id, name, is_active, description,
       categories_translations(locale, name, description)`
    )
    .order('name', { ascending: true });

  type Translation = { locale: string; name: string; description: string | null };

  const categories = (categoriesData ?? []).map((category) => {
    const arCat = (category as unknown as {
      categories_translations?: Translation[];
    }).categories_translations?.find((t) => t.locale === 'ar');

    return {
      id: category.id,
      name: category.name,
      is_active: category.is_active,
      description: category.description,
      name_ar: arCat?.name ?? null,
      description_ar: arCat?.description ?? null,
    };
  });

  return categories;
};

export const getMenuItemsForDashboard = async () => {
  await ensureStaff();
  const supabase = await createClient();

  const { data: itemsData } = await supabase
    .from('menu_items')
    .select(
      `*, 
       category:categories(id, name),
       menu_item_price(*), 
       menu_item_max_order_limits(*),
       menu_items_translations(locale, name, description)`
    )
    .order('name', { ascending: true });

  type Translation = { locale: string; name: string; description: string | null };
  type ItemWithTranslations = MenuItemRowType & { menu_items_translations?: Translation[] };

  const items = (itemsData ?? []).map((item: ItemWithTranslations) => {
    const arItem = item.menu_items_translations?.find((t) => t.locale === 'ar');

    return {
      ...item,
      name_ar: arItem?.name ?? null,
      description_ar: arItem?.description ?? null,
    } as MenuItemWithRelations;
  });

  return items;
};

