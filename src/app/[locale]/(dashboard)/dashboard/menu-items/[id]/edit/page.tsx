import { redirect, notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";

import { checkUserOnboarded } from "@/utils/auth.utils";
import { DashboardQueryProvider } from "@/components/dashboard/QueryProvider";
import { EditMenuItemPageClient } from "./EditMenuItemPageClient";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
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
  const { data: itemData } = await supabase
    .from('menu_items')
    .select(
      `*, 
       category:categories(id, name),
       menu_item_sizes(
         id,
         price,
         is_active,
         menu_item_size_translations(locale, name)
       ),
       menu_items_translations(locale, name, description)`
    )
    .eq('id', id)
    .maybeSingle();

  if (!itemData) {
    notFound();
  }

  type Translation = { locale: string; name: string; description: string | null };
  type SizeTranslation = { locale: string; name: string };
  type SizeWithTranslations = {
    id: string;
    price: number;
    is_active: boolean;
    menu_item_size_translations?: SizeTranslation[];
  };
  type ItemWithTranslations = typeof itemData & {
    menu_items_translations?: Translation[];
    menu_item_sizes?: SizeWithTranslations[];
  };

  const arItem = (itemData as unknown as ItemWithTranslations).menu_items_translations?.find(
    (translation: Translation) => translation.locale === 'ar'
  );

  const item = {
    id: itemData.id,
    category_id: itemData.category_id,
    name: itemData.name,
    name_ar: arItem?.name ?? null,
    description: itemData.description,
    description_ar: arItem?.description ?? null,
    image_key: itemData.image_key,
    availability: itemData.availability,
    is_active: itemData.is_active,
    menu_item_sizes: (itemData as unknown as ItemWithTranslations).menu_item_sizes ?? [],
  };

  return (
    <div className="min-h-screen bg-hlb-bg p-6 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <DashboardQueryProvider>
        <EditMenuItemPageClient locale={locale} itemId={id} item={item} />
      </DashboardQueryProvider>
    </div>
  );
}
