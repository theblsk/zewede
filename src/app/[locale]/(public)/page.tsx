import Hero from '@/components/Hero';
import MenuGrid from '@/components/MenuGrid';
import Contact from '@/components/Contact';
import { redirect } from 'next/navigation';
import { checkUserOnboarded } from '@/utils/auth.utils';
import { getLocale } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { getPublicMenuItems } from '@/utils/menu-items';
import { DEFAULT_SITE_SETTINGS, normalizeClosedDays } from '@/utils/site-settings';

type Translation = { locale: string; name: string; description?: string | null };

export default async function Home() {
  const locale = await getLocale();
  const userData = await checkUserOnboarded();
  const supabase = await createClient();

  // Only redirect to onboarding if user is logged in but not onboarded
  if (userData === undefined) {
    redirect(`/${locale}/onboarding`);
  }

  const { data: categoriesData } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      is_active,
      categories_translations(locale, name)
    `)
    .eq('is_active', true)
    .order('name', { ascending: true });

  const categories = (categoriesData ?? []).map((category) => {
    const translations = (category as typeof category & { categories_translations?: Translation[] }).categories_translations;
    const localizedName =
      locale === 'ar'
        ? translations?.find((t) => t.locale === 'ar')?.name ?? category.name
        : category.name;

    return {
      id: category.id,
      name: localizedName,
    };
  });

  const menuItems = await getPublicMenuItems({
    supabase,
    locale,
  });

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('hero_image_key, hero_image_backup_key, call_phone_number, whatsapp_phone_number, opening_hours_en, opening_hours_ar, closed_days')
    .maybeSingle();

  const siteSettings = {
    heroImageKey: settingsData?.hero_image_key ?? DEFAULT_SITE_SETTINGS.hero_image_key,
    heroImageBackupKey: settingsData?.hero_image_backup_key ?? DEFAULT_SITE_SETTINGS.hero_image_backup_key,
    callPhoneNumber: settingsData?.call_phone_number ?? DEFAULT_SITE_SETTINGS.call_phone_number,
    whatsappPhoneNumber: settingsData?.whatsapp_phone_number ?? DEFAULT_SITE_SETTINGS.whatsapp_phone_number,
    openingHours:
      locale === 'ar'
        ? settingsData?.opening_hours_ar ?? DEFAULT_SITE_SETTINGS.opening_hours_ar
        : settingsData?.opening_hours_en ?? DEFAULT_SITE_SETTINGS.opening_hours_en,
    closedDays: normalizeClosedDays(settingsData?.closed_days),
  };

  return (
    <main>
      <Hero
        heroImageKey={siteSettings.heroImageKey}
        heroImageBackupKey={siteSettings.heroImageBackupKey}
      />
      <MenuGrid categories={categories} items={menuItems} />
      <Contact
        callPhoneNumber={siteSettings.callPhoneNumber}
        whatsappPhoneNumber={siteSettings.whatsappPhoneNumber}
        openingHours={siteSettings.openingHours}
        closedDays={siteSettings.closedDays}
      />
    </main>
  );
}
