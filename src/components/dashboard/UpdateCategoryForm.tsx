"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  categoryFormSchema,
  type CategoryFormInput,
} from "@/validators/category";
import { updateCategoryFromValues } from "@/app/[locale]/(dashboard)/dashboard/actions";
import { CategoryFormFields } from "./CategoryFormFields";

// Category data shape from DashboardClient
type CategoryData = {
  id: string;
  name: string;
  name_ar?: string | null;
  description: string | null;
  description_ar?: string | null;
  is_active: boolean;
};

export type UpdateCategoryFormProps = {
  categoryId: string;
  category: CategoryData;
  onSuccess?: () => void;
};

// Function that creates and returns the form hook
export function useUpdateCategoryForm({
  categoryId,
  category,
  onSuccess,
}: UpdateCategoryFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Transform category data to form defaultValues internally
  const defaultValues = {
    name: category.name ?? "",
    name_ar: category.name_ar ?? "",
    description: category.description ?? "",
    description_ar: category.description_ar ?? "",
    is_active: category.is_active ?? true,
  } satisfies CategoryFormInput;

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      // Validate the form data
      const validated = categoryFormSchema.parse(value);

      const formData: CategoryFormInput & {
        locale?: string;
      } = {
        locale,
        ...validated,
      };

      const result = await updateCategoryFromValues(categoryId, formData);
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

// Infer the return type
export type UpdateCategoryFormType = ReturnType<typeof useUpdateCategoryForm>;

// Component that uses the hook and renders the form
export const UpdateCategoryForm = (props: UpdateCategoryFormProps) => {
  const { form, isPending } = useUpdateCategoryForm(props);
  const t = useTranslations('dashboard.categories');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <CategoryFormFields form={form} submitLabel={t('saveChanges')} isPending={isPending} />
    </form>
  );
};
