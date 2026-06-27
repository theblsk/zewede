"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { MenuItemFormInput } from "@/validators/menu-item";
import { updateMenuItemFromValues } from "@/app/[locale]/(dashboard)/dashboard/actions";
import { MenuItemFormFields } from "./MenuItemFormFields";
import {
  useMenuItemForm,
  menuItemToFormValues,
} from "@/hooks/useMenuItemForm";

type MenuItemData = {
  id: string;
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
};

export type UpdateMenuItemFormProps = {
  itemId: string;
  item: MenuItemData;
  onSuccess?: () => void;
};

export function useUpdateMenuItemForm({
  itemId,
  item,
  onSuccess,
}: UpdateMenuItemFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const t = useTranslations('dashboard.items');

  const form = useMenuItemForm({
    defaultValues: menuItemToFormValues(item),
    onSubmit: async (validated) => {
      setFormError(null);
      setIsSaving(true);

      try {
        const formData: MenuItemFormInput & {
          locale?: string;
        } = {
          locale,
          ...validated,
        };

        const result = await updateMenuItemFromValues(itemId, formData);
        if (result.ok) {
          startTransition(() => {
            router.refresh();
            onSuccess?.();
          });
        } else {
          setFormError(result.message);
        }
      } catch (error) {
        setFormError(error instanceof Error ? error.message : t('saveError'));
      } finally {
        setIsSaving(false);
      }
    },
  });

  return { form, formError, isPending: isPending || isSaving };
}

export type UpdateMenuItemFormType = ReturnType<typeof useUpdateMenuItemForm>;

export const UpdateMenuItemForm = (props: UpdateMenuItemFormProps) => {
  const { form, formError, isPending } = useUpdateMenuItemForm(props);
  const t = useTranslations('dashboard.items');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {formError ? <p className="text-sm text-danger">{formError}</p> : null}
      <MenuItemFormFields form={form} submitLabel={t('saveChanges')} isPending={isPending} />
    </form>
  );
};
