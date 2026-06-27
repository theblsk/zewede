"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ZodError } from "zod";
import {
  categoryFormSchema,
  type CategoryFormInput,
} from "@/validators/category";
import { createCategoryFromValues } from "@/app/[locale]/(dashboard)/dashboard/actions";
import { CategoryFormFields } from "./CategoryFormFields";

export type CreateCategoryFormProps = {
  onSuccess?: () => void;
};

// Function that creates and returns the form hook
export function useCreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const t = useTranslations('dashboard.categories');

  const form = useForm({
    defaultValues: {
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      is_active: true,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      setFormError(null);
      setIsSaving(true);

      try {
        // Validate the form data
        const validated = categoryFormSchema.parse(value);

        const formData: CategoryFormInput & {
          locale?: string;
        } = {
          locale,
          ...validated,
        };

        const result = await createCategoryFromValues(formData);
        if (result.ok) {
          startTransition(() => {
            router.refresh();
            onSuccess?.();
          });
        } else {
          setFormError(result.message || t('saveError'));
        }
      } catch (error) {
        if (error instanceof ZodError) {
          const firstIssue = error.issues[0];
          setFormError(firstIssue?.message ?? t('saveError'));
        } else if (error instanceof Error && error.message) {
          setFormError(error.message);
        } else {
          setFormError(t('saveError'));
        }
      } finally {
        setIsSaving(false);
      }
    },
  });

  return { form, formError, isPending: isPending || isSaving };
}

// Infer the return type
export type CreateCategoryFormType = ReturnType<typeof useCreateCategoryForm>;

// Component that uses the hook and renders the form
export const CreateCategoryForm = (props: CreateCategoryFormProps) => {
  const { form, formError, isPending } = useCreateCategoryForm(props);
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
      {formError ? <p className="text-sm text-danger">{formError}</p> : null}
      <CategoryFormFields form={form} submitLabel={t('create')} isPending={isPending} />
    </form>
  );
};
