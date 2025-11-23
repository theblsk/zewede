import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { checkUserOnboarded } from "@/utils/auth.utils";
import { CreateCategoryPageClient } from "./CreateCategoryPageClient";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function CreateCategoryPage() {
  const locale = await getLocale();

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

  return (
    <div className="min-h-screen bg-hlb-bg p-6 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <CreateCategoryPageClient locale={locale} />
    </div>
  );
}
