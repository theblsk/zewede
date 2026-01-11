'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';

type SupportedLocale = 'en' | 'ar';

const PREFERENCE_KEY = 'preferredLocale';

const isSupportedLocale = (value: string | null): value is SupportedLocale =>
  value === 'en' || value === 'ar';

export function LanguagePreferencePrompt() {
  const t = useTranslations('languageSelector');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PREFERENCE_KEY);

    if (isSupportedLocale(stored)) {
      if (stored !== locale) {
        router.replace(pathname, { locale: stored });
      }
      return;
    }

    setIsOpen(true);
  }, [locale, pathname, router]);

  const handleSelect = (nextLocale: SupportedLocale) => {
    localStorage.setItem(PREFERENCE_KEY, nextLocale);
    setIsOpen(false);

    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} hideCloseButton placement="center">
      <ModalContent>
        <div className="p-6 space-y-5">
          <ModalHeader className="pb-0 text-center">
            <div className="space-y-1">
              <p className="text-xl font-bold text-hlb-primary" dir="rtl">
                {t('titleAr')}
              </p>
              <p className="text-lg font-semibold text-hlb-primary" dir="ltr">
                {t('titleEn')}
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="pt-0 text-hlb-text-light space-y-2">
            <p className="text-base" dir="rtl">
              {t('descriptionAr')}
            </p>
            <p className="text-base" dir="ltr">
              {t('descriptionEn')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button color="primary" onPress={() => handleSelect('en')} fullWidth>
                {t('english')}
              </Button>
              <Button variant="flat" onPress={() => handleSelect('ar')} fullWidth>
                {t('arabic')}
              </Button>
            </div>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
}
