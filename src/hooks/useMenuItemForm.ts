"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import {
  menuItemFormSchema,
  type MenuItemFormInput,
} from "@/validators/menu-item";

/**
 * Shared form values type for menu item forms
 * All form values are strings (as per MenuItemFormInput)
 */
export type MenuItemFormValues = MenuItemFormInput;

/**
 * Options for creating a menu item form
 */
export type UseMenuItemFormOptions = {
  defaultValues: MenuItemFormValues;
  onSubmit: (values: MenuItemFormValues) => Promise<void>;
};

/**
 * Shared hook for creating menu item forms with consistent types
 * This ensures both create and update forms use the same form structure
 */
export function useMenuItemForm({
  defaultValues,
  onSubmit,
}: UseMenuItemFormOptions) {
  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      await menuItemFormSchema.parseAsync(value);
      await onSubmit(value);
    },
  });

  return form;
}

/**
 * Shared form type that both create and update forms can use
 */
export type MenuItemFormApi = ReturnType<typeof useMenuItemForm>;

/**
 * Helper function to create default values for create form
 */
export function getCreateMenuItemDefaultValues(): MenuItemFormValues {
  return {
    category_id: "",
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    image_key: "",
    availability: true,
    is_active: true,
    sizes: [
      {
        name: "",
        name_ar: "",
        price: "0",
        is_active: true,
      },
    ],
  };
}

/**
 * Helper function to transform menu item data to form values
 */
export function menuItemToFormValues(item: {
  category_id: string;
  name: string;
  name_ar?: string | null;
  description: string | null;
  description_ar?: string | null;
  image_key: string | null;
  availability: boolean;
  is_active: boolean;
  menu_item_sizes?: Array<{
    id: string;
    price: number;
    is_active: boolean;
    menu_item_size_translations?: Array<{
      locale: string;
      name: string;
    }>;
  }>;
}): MenuItemFormValues {
  const sizes = item.menu_item_sizes && item.menu_item_sizes.length > 0
    ? item.menu_item_sizes.map((size) => {
        const enTranslation = size.menu_item_size_translations?.find((t) => t.locale === "en");
        const arTranslation = size.menu_item_size_translations?.find((t) => t.locale === "ar");
        return {
          id: size.id,
          name: enTranslation?.name ?? "",
          name_ar: arTranslation?.name ?? "",
          price: String(size.price),
          is_active: size.is_active,
        };
      })
    : [
        {
          name: "",
          name_ar: "",
          price: "0",
          is_active: true,
        },
      ];

  return {
    category_id: item.category_id ?? "",
    name: item.name ?? "",
    name_ar: item.name_ar ?? "",
    description: item.description ?? "",
    description_ar: item.description_ar ?? "",
    image_key: item.image_key ?? "",
    availability: item.availability ?? true,
    is_active: item.is_active ?? true,
    sizes,
  };
}

