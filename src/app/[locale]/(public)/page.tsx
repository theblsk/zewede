import Hero from '@/components/Hero';
import MenuGrid from '@/components/MenuGrid';
import Contact from '@/components/Contact';
import { redirect } from 'next/navigation';
import { checkUserOnboarded } from '@/utils/auth.utils';
import { getLocale } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { getPublicMenuItems } from '@/utils/menu-items';

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
    limit: 9,
  });

  return (
    <main>
      <Hero />
      <MenuGrid categories={categories} items={menuItems} />
      <Contact />
    </main>
  );
}
