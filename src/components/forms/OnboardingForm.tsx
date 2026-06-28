"use client";

import { useForm } from "@tanstack/react-form";

import {
  Button,
  Input,
  Textarea,
  Tooltip,
  Select,
  SelectItem,
} from "@heroui/react";
import { Info } from "lucide-react";
import {
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import {
  formSchema,
  defaultFormValues,
} from "@/app/config/onboard-form.config";
import { onboarding } from "@/app/[locale]/(public)/onboarding/actions";
import { redirect } from "next/navigation";
import type { CountryOption } from "@/utils/country-codes";

function TooltipButton({ label, tooltip }: { label: string; tooltip: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Tooltip
      radius="sm"
      size="sm"
      placement="top"
      className="bg-hlb-primary"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      shouldCloseOnInteractOutside={() => {
        handleClose();
        return true;
      }}
      content={
        <span className="max-w-[240px] text-left text-xs text-default-50">
          {tooltip}
        </span>
      }
    >
      <button
        type="button"
        aria-label={`${label} info`}
        aria-expanded={isOpen}
        onClick={handleToggle}
        onFocus={() => setIsOpen(true)}
        onBlur={handleClose}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={handleClose}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-default-200 bg-default-100 text-default-500 transition-colors hover:border-default-300 hover:text-default-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hlb-primary/60"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
    </Tooltip>
  );
}

const getFirstErrorFromMap = (map: unknown): string | undefined => {
  if (!map || typeof map !== "object") return undefined;
  const values = Object.values(map as Record<string, unknown>);
  for (const v of values) {
    if (!v) continue;
    if (typeof v === "string") return v;
    if (Array.isArray(v) && v.length > 0) {
      const first = v[0] as unknown;
      if (typeof first === "string") return first;
      if (
        first &&
        typeof first === "object" &&
        "message" in (first as Record<string, unknown>)
      ) {
        return (first as { message?: string }).message;
      }
    }
    if (
      typeof v === "object" &&
      v &&
      "message" in (v as Record<string, unknown>)
    ) {
      return (v as { message?: string }).message;
    }
  }
  return undefined;
};

interface OnboardingFormProps {
  countryOptions: CountryOption[];
}

export default function OnboardingForm({ countryOptions }: OnboardingFormProps) {
  const t = useTranslations("onboarding.form");
  const locale = useLocale();

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    defaultFormValues.country_code
  );

  const form = useForm({
    defaultValues: defaultFormValues,
    onSubmit: async ({ value }) => {
      const result = await onboarding(value);
      if (result.success) {
        redirect(`/${locale}`);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-7"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 sm:flex-row">
          <form.Field
            name="first_name"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: formSchema.shape.first_name,
            }}
          >
            {(field) => (
              <Input
                required
                value={field.state.value}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
                label={t("first_name.label")}
                placeholder={t("first_name.placeholder")}
                isInvalid={Boolean(
                  getFirstErrorFromMap(field.state.meta.errorMap)
                )}
                errorMessage={
                  getFirstErrorFromMap(
                    field.state.meta.errorMap
                  ) as unknown as string
                }
                variant="bordered"
                size="lg"
                autoComplete="given-name"
                className="sm:w-1/2"
                endContent={
                  <TooltipButton
                    label={t("first_name.label")}
                    tooltip={t("first_name.tooltip")}
                  />
                }
              />
            )}
          </form.Field>

          <form.Field
            name="last_name"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: formSchema.shape.last_name,
            }}
          >
            {(field) => (
              <Input
                required
                value={field.state.value}
                onValueChange={field.handleChange}
                onBlur={field.handleBlur}
                label={t("last_name.label")}
                placeholder={t("last_name.placeholder")}
                isInvalid={Boolean(
                  getFirstErrorFromMap(field.state.meta.errorMap)
                )}
                errorMessage={
                  getFirstErrorFromMap(
                    field.state.meta.errorMap
                  ) as unknown as string
                }
                variant="bordered"
                size="lg"
                autoComplete="family-name"
                className="sm:w-1/2"
                endContent={
                  <TooltipButton
                    label={t("last_name.label")}
                    tooltip={t("last_name.tooltip")}
                  />
                }
              />
            )}
          </form.Field>
        </div>
        <div className="flex flex-col gap-5">
          <label className="text-sm font-medium text-foreground">
            {t("phone_number.label")}
          </label>
          <div className="flex flex-col items-start sm:flex-row gap-3 sm:gap-3">
            <form.Field name="country_code">
              {(field) => {
                const selectedCountryCode = countryOptions.find(
                  (option) => option.callingCode === field.state.value
                )?.code;

                return (
                <Select
                  selectedKeys={selectedCountryCode ? [selectedCountryCode] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as
                      | string
                      | undefined;
                    if (!selectedKey) {
                      return;
                    }

                    const country = countryOptions.find(
                      (option) => option.code === selectedKey
                    );
                    if (country) {
                      field.handleChange(country.callingCode);
                      setSelectedCountryCode(country.callingCode);
                    }
                  }}
                  className="w-full sm:flex-1"
                  size="lg"
                  variant="bordered"
                  aria-label="Select country code"
                  renderValue={(items) => {
                    const selectedItem = items[0];
                    if (!selectedItem) return null;

                    const country = countryOptions.find(
                      (option) => option.code === selectedItem.key
                    );
                    if (!country) return null;

                    return (
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{country.flag}</span>
                        <span className="text-sm font-medium">
                          {country.name}
                        </span>
                      </div>
                    );
                  }}
                >
                  {countryOptions.map((country) => (
                    <SelectItem
                      key={country.code}
                      textValue={`${country.name} ${country.callingCode}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{country.flag}</span>
                        <span className="text-sm font-medium">
                          {country.name}
                        </span>
                        <span className="text-xs text-default-500">
                          {country.callingCode}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
                );
              }}
            </form.Field>

            <form.Field
              name="phone_number"
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  const trimmed = (value ?? "").trim();
                  if (!trimmed) {
                    return "Phone number is required";
                  }
                  const full = `${selectedCountryCode ?? ""}${trimmed}`;
                  const parsed = parsePhoneNumberFromString(full);
                  if (!parsed || !parsed.isValid()) {
                    return "Invalid phone number";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Input
                  required
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder={t("phone_number.placeholder")}
                  isInvalid={Boolean(
                    getFirstErrorFromMap(field.state.meta.errorMap)
                  )}
                  errorMessage={
                    getFirstErrorFromMap(
                      field.state.meta.errorMap
                    ) as unknown as string
                  }
                  variant="bordered"
                  size="lg"
                  inputMode="tel"
                  autoComplete="tel"
                  className="w-full sm:flex-1"
                  endContent={
                    <TooltipButton
                      label={t("phone_number.label")}
                      tooltip={t("phone_number.tooltip")}
                    />
                  }
                />
              )}
            </form.Field>
          </div>
        </div>

        <form.Field
          name="delivery_address"
          validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: formSchema.shape.delivery_address,
          }}
        >
          {(field) => (
            <Textarea
              required
              value={field.state.value}
              onValueChange={field.handleChange}
              onBlur={field.handleBlur}
              label={t("delivery_address.label")}
              placeholder={t("delivery_address.placeholder")}
              minRows={3}
              isInvalid={Boolean(
                getFirstErrorFromMap(field.state.meta.errorMap)
              )}
              errorMessage={
                getFirstErrorFromMap(
                  field.state.meta.errorMap
                ) as unknown as string
              }
              variant="bordered"
              autoComplete="street-address"
              endContent={
                <TooltipButton
                  label={t("delivery_address.label")}
                  tooltip={t("delivery_address.tooltip")}
                />
              }
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              color="primary"
              radius="sm"
              size="lg"
              className="font-semibold"
              isDisabled={!canSubmit}
              isLoading={isSubmitting}
            >
              {t("submit")}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
