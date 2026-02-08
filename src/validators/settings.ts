import { z } from 'zod';

import { CLOSED_DAY_VALUES } from '@/utils/site-settings';

const closedDaySchema = z.enum(CLOSED_DAY_VALUES);

export const settingsFormSchema = z.object({
  hero_image_key: z.string().optional(),
  call_phone_number: z.string().trim().min(1, 'Call phone number is required'),
  whatsapp_phone_number: z.string().trim().min(1, 'WhatsApp phone number is required'),
  opening_hours_en: z.string().trim().min(1, 'English opening hours are required'),
  opening_hours_ar: z.string().trim().min(1, 'Arabic opening hours are required'),
  closed_days: z.array(closedDaySchema).default([]),
});

export type SettingsFormInput = z.input<typeof settingsFormSchema>;

export const settingsServerSchema = z.object({
  heroImageKey: z
    .string()
    .optional()
    .transform((value) => (value && value.trim().length > 0 ? value : null)),
  callPhoneNumber: z.string().trim().min(1),
  whatsappPhoneNumber: z.string().trim().min(1),
  openingHoursEn: z.string().trim().min(1),
  openingHoursAr: z.string().trim().min(1),
  closedDays: z
    .array(closedDaySchema)
    .transform((days) => Array.from(new Set(days))),
});
