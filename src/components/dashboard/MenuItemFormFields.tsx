"use client";

import { Button, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getCategoriesForDashboard } from "@/app/[locale]/(dashboard)/dashboard/actions";
import { ImageUpload } from "./ImageUpload";
import type { MenuItemFormApi } from "@/hooks/useMenuItemForm";

type MenuItemFormFieldsProps = {
  form: MenuItemFormApi;
  submitLabel: string;
  isPending: boolean;
};

export const MenuItemFormFields = ({ form, submitLabel, isPending }: MenuItemFormFieldsProps) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesForDashboard,
  });
  const t = useTranslations('dashboard.items.form');

  return (
    <>
      <form.Field name="image_key">
        {(field) => (
          <ImageUpload
            label={t('image')}
            value={field.state.value ?? undefined}
            onChange={field.handleChange}
            disabled={isPending}
          />
        )}
      </form.Field>

      <form.Field name="category_id">
        {(field) => (
          <Select
            name={field.name}
            label={t('category')}
            placeholder={t('selectCategory')}
            selectedKeys={field.state.value ? [String(field.state.value)] : []}
            variant="bordered"
            isRequired
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0];
              field.handleChange(key ?? "");
            }}
            onBlur={field.handleBlur}
          >
            {categories.map((category) => (
              <SelectItem key={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>
        )}
      </form.Field>

      <form.Field name="name">
        {(field) => (
          <Input
            name={field.name}
            label={t('name')}
            value={field.state.value as string}
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
            value={(field.state.value as string) ?? ""}
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
            value={(field.state.value as string) ?? ""}
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
            value={(field.state.value as string) ?? ""}
            variant="bordered"
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={field.handleChange}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="price_type">
        {(field) => (
          <Select
            name={field.name}
            label={t('priceUnit')}
            selectedKeys={field.state.value ? [String(field.state.value)] : []}
            variant="bordered"
            isRequired
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0] as "gram" | "box" | undefined;
              field.handleChange(key ?? "gram");
            }}
            onBlur={field.handleBlur}
          >
            <SelectItem key="gram">
              {t('gram')}
            </SelectItem>
            <SelectItem key="box">
              {t('box')}
            </SelectItem>
          </Select>
        )}
      </form.Field>

      <form.Field name="price_count">
        {(field) => (
          <Input
            name={field.name}
            label={t('priceCount')}
            type="number"
            value={String(field.state.value ?? "1")}
            variant="bordered"
            isRequired
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={(val) => field.handleChange(val)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="price_amount">
        {(field) => (
          <Input
            name={field.name}
            label={t('priceAmount')}
            type="number"
            value={String(field.state.value ?? "0")}
            variant="bordered"
            isRequired
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={(val) => field.handleChange(val)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="max_order_limit_unit">
        {(field) => (
          <Select
            name={field.name}
            label={t('maxOrderLimitUnit')}
            placeholder={t('selectUnit')}
            selectedKeys={field.state.value ? [String(field.state.value)] : []}
            variant="bordered"
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0];
              field.handleChange((key as "box" | "gram") ?? undefined);
            }}
            onBlur={field.handleBlur}
          >
            <SelectItem key="gram">
              {t('gram')}
            </SelectItem>
            <SelectItem key="box">
              {t('box')}
            </SelectItem>
          </Select>
        )}
      </form.Field>

      <form.Field name="max_order_limit_value">
        {(field) => (
          <Input
            name={field.name}
            label={t('maxOrderLimitValue')}
            type="number"
            value={field.state.value ? String(field.state.value) : ""}
            variant="bordered"
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={field.state.meta.errors.join(", ")}
            onValueChange={(val) => field.handleChange(val || undefined)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="availability">
        {(field) => (
          <Checkbox name={field.name} isSelected={field.state.value} onValueChange={field.handleChange}>
            {t('available')}
          </Checkbox>
        )}
      </form.Field>

      <form.Field name="is_active">
        {(field) => (
          <Checkbox name={field.name} isSelected={field.state.value} onValueChange={field.handleChange}>
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
