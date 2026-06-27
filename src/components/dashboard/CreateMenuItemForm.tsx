"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const t = useTranslations('dashboard.items');

  const form = useMenuItemForm({
    defaultValues: getCreateMenuItemDefaultValues(),
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

        const result = await createMenuItemFromValues(formData);
        if (result.ok) {
          startTransition(() => {
            router.refresh();
            onSuccess?.();
          });
        } else {
          setFormError(result.message || t('saveError'));
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

export type CreateMenuItemFormType = ReturnType<typeof useCreateMenuItemForm>;

export const CreateMenuItemForm = (props: CreateMenuItemFormProps) => {
  const { form, formError, isPending } = useCreateMenuItemForm(props);
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
      <MenuItemFormFields form={form} submitLabel={t('create')} isPending={isPending} />
    </form>
  );
};
