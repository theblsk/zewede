"use client";

import { Button, Checkbox, Input, Select, SelectItem, Card, CardBody, CardHeader } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
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
    queryFn: () => getCategoriesForDashboard(),
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

      <form.Field name="sizes">
        {(field) => {
          const sizes = (field.state.value as Array<{ name: string; name_ar?: string; price: string; is_active: boolean; id?: string }>) ?? [];
          const fieldErrors = field.state.meta.errors;

          return (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t('sizes')}</label>
                <Button
                  type="button"
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<Plus className="w-4 h-4" />}
                  onPress={() => {
                    const newSizes = [...sizes, { name: "", name_ar: "", price: "0", is_active: true }];
                    field.handleChange(newSizes);
                  }}
                  isDisabled={isPending}
                >
                  {t('addSize')}
                </Button>
              </div>
              {fieldErrors.length > 0 && (
                <p className="text-sm text-danger">{fieldErrors.join(", ")}</p>
              )}
              {sizes.map((_, index) => (
                <Card key={index} className="p-4">
                  <CardHeader className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-semibold">{t('size')} {index + 1}</h3>
                    {sizes.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => {
                          const newSizes = sizes.filter((_, i) => i !== index);
                          field.handleChange(newSizes);
                        }}
                        isDisabled={isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardBody className="flex flex-col gap-3 pt-0">
                    <form.Field name={`sizes[${index}].name`}>
                      {(sizeField) => (
                        <Input
                          name={sizeField.name}
                          label={t('sizeName')}
                          value={sizeField.state.value as string}
                          variant="bordered"
                          isRequired
                          isInvalid={sizeField.state.meta.errors.length > 0}
                          errorMessage={sizeField.state.meta.errors.join(", ")}
                          onValueChange={sizeField.handleChange}
                          onBlur={sizeField.handleBlur}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`sizes[${index}].name_ar`}>
                      {(sizeField) => (
                        <Input
                          name={sizeField.name}
                          label={t('sizeNameAr')}
                          value={(sizeField.state.value as string) ?? ""}
                          variant="bordered"
                          isInvalid={sizeField.state.meta.errors.length > 0}
                          errorMessage={sizeField.state.meta.errors.join(", ")}
                          onValueChange={sizeField.handleChange}
                          onBlur={sizeField.handleBlur}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`sizes[${index}].price`}>
                      {(sizeField) => (
                        <Input
                          name={sizeField.name}
                          label={t('price')}
                          type="number"
                          value={String(sizeField.state.value ?? "0")}
                          variant="bordered"
                          isRequired
                          isInvalid={sizeField.state.meta.errors.length > 0}
                          errorMessage={sizeField.state.meta.errors.join(", ")}
                          onValueChange={(val) => sizeField.handleChange(val)}
                          onBlur={sizeField.handleBlur}
                        />
                      )}
                    </form.Field>
                    <form.Field name={`sizes[${index}].is_active`}>
                      {(sizeField) => (
                        <Checkbox
                          name={sizeField.name}
                          isSelected={sizeField.state.value}
                          onValueChange={sizeField.handleChange}
                        >
                          {t('active')}
                        </Checkbox>
                      )}
                    </form.Field>
                  </CardBody>
                </Card>
              ))}
            </div>
          );
        }}
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
