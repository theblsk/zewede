import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { checkUserOnboarded } from "@/utils/auth.utils";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default async function DashboardPage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("dashboard"),
  ]);

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
    <div className="min-h-screen bg-hlb-bg p-6">
      <DashboardTabs
        locale={locale}
        translations={{
          pageTitle: t("title"),
          pageSubtitle: t("welcome"),
        }}
      />
    </div>
  );
}
