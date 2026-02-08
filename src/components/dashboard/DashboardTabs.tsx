'use client';

import { Tabs, Tab } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';
import { useState, useTransition, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardQueryProvider } from './QueryProvider';
import { CategoriesTable } from './CategoriesTable';
import { MenuItemsTable } from './MenuItemsTable';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { TableSkeleton } from '@/components/dashboard/TableSkeleton';

type DashboardTabsProps = {
  locale: string;
  translations: {
    pageTitle: string;
    pageSubtitle: string;
  };
};

export default function DashboardTabs({ locale, translations }: DashboardTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('dashboard');
  
  const tabFromUrl = searchParams.get('tab');
  const allowedTabs = new Set(['categories', 'menu-items', 'settings']);
  const urlTab = tabFromUrl && allowedTabs.has(tabFromUrl) ? tabFromUrl : 'categories';
  const [selectedTab, setSelectedTab] = useState(urlTab);

  useEffect(() => {
    setSelectedTab(urlTab);
  }, [urlTab]);

  const handleTabChange = (key: string | number) => {
    const newTab = String(key);
    setSelectedTab(newTab); // Optimistic update
    
    startTransition(() => {
      router.replace(`/${locale}${pathname}?tab=${newTab}`, { scroll: false });
    });
  };

  return (
    <DashboardQueryProvider>
      <div className="max-w-7xl mx-auto space-y-6 relative">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-hlb-primary">{translations.pageTitle}</h1>
            <p className="text-hlb-text/80">{translations.pageSubtitle}</p>
          </div>
          <LanguageSwitcher />
        </header>

        <Tabs 
          aria-label={t('tabsAriaLabel')} 
          selectedKey={selectedTab}
          onSelectionChange={handleTabChange}
        >
          <Tab key="categories" title={t('categories.title')}>
            <div className="mt-4">
              {isPending && selectedTab === 'categories' ? (
                <TableSkeleton />
              ) : (
                <CategoriesTable locale={locale} />
              )}
            </div>
          </Tab>
          <Tab key="menu-items" title={t('items.title')}>
            <div className="mt-4">
              {isPending && selectedTab === 'menu-items' ? (
                <TableSkeleton />
              ) : (
                <MenuItemsTable locale={locale} />
              )}
            </div>
          </Tab>
          <Tab key="settings" title={t('settings.title')}>
            <div className="mt-4">
              {isPending && selectedTab === 'settings' ? (
                <TableSkeleton />
              ) : (
                <SettingsPanel locale={locale} />
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardQueryProvider>
  );
}
