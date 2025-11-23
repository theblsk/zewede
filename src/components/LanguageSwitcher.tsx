'use client';

import { Button } from "@heroui/button";
import { Globe } from "lucide-react";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale(); // 'en' | 'ar'
  const pathname = usePathname();
  const router = useRouter();

  function handleLanguageSwitch() {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    // Replace current route with the same path under the other locale
    router.replace(pathname, { locale: nextLocale });
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

