'use client';

import { Button } from "@heroui/button";
import { Globe } from "lucide-react";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

const PREFERENCE_KEY = 'preferredLocale';

export function LanguageSwitcher() {
  const locale = useLocale(); // 'en' | 'ar'
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleLanguageSwitch() {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    localStorage.setItem(PREFERENCE_KEY, nextLocale);
    const query = searchParams.toString();
    const target = query ? `${pathname}?${query}` : pathname;
    // Replace current route with the same path under the other locale
    router.replace(target, { locale: nextLocale });
  }

  return (
    <Button
      variant="light"
      size="sm"
      onPress={handleLanguageSwitch}
      className="text-hlb-primary hover:text-hlb-gold min-w-0 px-2"
      aria-label="Switch language"
    >
      <Globe size={20} />
    </Button>
  );
}
