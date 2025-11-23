import { redirect, notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";

import { checkUserOnboarded } from "@/utils/auth.utils";
import { EditCategoryPageClient } from "./EditCategoryPageClient";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const { id } = await params;

  const userData = await checkUserOnboarded();

  if (!userData) {
    redirect(`/${locale}/onboarding`);
  }

  switch (userData.role) {
    case "ADMIN":
    case "MANAGER":
      break;
    default:
      redirect(`/${locale}`);
  }

  const supabase = await createClient();
  const { data: categoryData } = await supabase
    .from('categories')
    .select(
      `id, name, is_active, description,
       categories_translations(locale, name, description)`
    )
    .eq('id', id)
    .maybeSingle();

  if (!categoryData) {
    notFound();
  }

  type Translation = { locale: string; name: string; description: string | null };
  const arCat = (categoryData as unknown as {
    categories_translations?: Translation[];
  }).categories_translations?.find((t) => t.locale === 'ar');

  const category = {
    id: categoryData.id,
    name: categoryData.name,
    is_active: categoryData.is_active,
    description: categoryData.description,
    name_ar: arCat?.name ?? null,
    description_ar: arCat?.description ?? null,
  };

  return (
    <div className="min-h-screen bg-hlb-bg p-6 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <EditCategoryPageClient locale={locale} categoryId={id} category={category} />
    </div>
  );
}
