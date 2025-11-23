"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import type { MenuItemFormInput } from "@/validators/menu-item";
import { createMenuItemFromValues } from "@/app/[locale]/(dashboard)/dashboard/actions";
import { MenuItemFormFields } from "./MenuItemFormFields";
import {
  useMenuItemForm,
  getCreateMenuItemDefaultValues,
} from "@/hooks/useMenuItemForm";

export type CreateMenuItemFormProps = {
  onSuccess?: () => void;
};

export function useCreateMenuItemForm({ onSuccess }: CreateMenuItemFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useMenuItemForm({
    defaultValues: getCreateMenuItemDefaultValues(),
    onSubmit: async (validated) => {
      const formData: MenuItemFormInput & {
        locale?: string;
      } = {
        locale,
        ...validated,
      };

      const result = await createMenuItemFromValues(formData);
      if (result.ok) {
        startTransition(() => {
          router.refresh();
          onSuccess?.();
        });
      } else {
        console.error(result.message);
      }
    },
  });

  return { form, isPending };
}

export type CreateMenuItemFormType = ReturnType<typeof useCreateMenuItemForm>;

export const CreateMenuItemForm = (props: CreateMenuItemFormProps) => {
  const { form, isPending } = useCreateMenuItemForm(props);
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
      <MenuItemFormFields form={form} submitLabel={t('create')} isPending={isPending} />
    </form>
  );
};
