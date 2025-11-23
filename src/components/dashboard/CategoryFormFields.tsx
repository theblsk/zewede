"use client";

import { Button, Checkbox, Input } from "@heroui/react";
import { useTranslations } from "next-intl";
import { type CreateCategoryFormType } from "./CreateCategoryForm";

type CategoryFormFieldsProps = {
  form: CreateCategoryFormType["form"];
  submitLabel: string;
  isPending: boolean;
};

export const CategoryFormFields = ({
  form,
  submitLabel,
  isPending,
}: CategoryFormFieldsProps) => {
  const t = useTranslations('dashboard.categories.form');

  return (
    <>
      <form.Field name="name">
        {(field) => (
          <Input
            name={field.name}
            label={t('name')}
            value={field.state.value}
            variant="bordered"
            isRequired
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={field.handleChange}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="name_ar">
        {(field) => (
          <Input
            name={field.name}
            label={t('nameAr')}
            value={field.state.value ?? ""}
            variant="bordered"
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={field.handleChange}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <Input
            name={field.name}
            label={t('description')}
            value={field.state.value ?? ""}
            variant="bordered"
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={field.handleChange}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="description_ar">
        {(field) => (
          <Input
            name={field.name}
            label={t('descriptionAr')}
            value={field.state.value ?? ""}
            variant="bordered"
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={field.handleChange}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="is_active">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => (
          <Checkbox
            name={field.name}
            isSelected={field.state.value}
            onValueChange={field.handleChange}
          >
            {t('active')}
          </Checkbox>
        )}
      </form.Field>

      <Button
        type="submit"
        color="primary"
        radius="sm"
        size="lg"
        className="font-semibold"
        isDisabled={isPending}
        isLoading={isPending}
      >
        {submitLabel}
      </Button>
    </>
  );
};
