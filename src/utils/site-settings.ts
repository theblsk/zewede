export const LANDING_ASSETS_BUCKET = 'landing-assets';
export const DEFAULT_HERO_IMAGE_PATH = '/zaatar.avif';

export const CLOSED_DAY_VALUES = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type ClosedDayValue = (typeof CLOSED_DAY_VALUES)[number];

type SiteSettingsDefaults = {
  hero_image_key: string | null;
  hero_image_backup_key: string | null;
  call_phone_number: string;
  whatsapp_phone_number: string;
  opening_hours_en: string;
  opening_hours_ar: string;
  closed_days: ClosedDayValue[];
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsDefaults = {
  hero_image_key: null,
  hero_image_backup_key: null,
  call_phone_number: '+961 81 484 472',
  whatsapp_phone_number: '+961 81 484 472',
  opening_hours_en: '7:30 AM - 2:30 PM, 6:00 PM - 10:00 PM',
  opening_hours_ar: '٧:٣٠ ص - ٢:٣٠ م، ٦:٠٠ م - ١٠:٠٠ م',
  closed_days: [],
};

export function normalizeClosedDays(days: string[] | null | undefined): ClosedDayValue[] {
  if (!days) {
    return [];
  }

  const validValues = new Set<string>(CLOSED_DAY_VALUES);
  return Array.from(new Set(days)).filter((day): day is ClosedDayValue => validValues.has(day));
}
