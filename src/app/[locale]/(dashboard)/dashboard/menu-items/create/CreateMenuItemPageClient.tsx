'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { CreateMenuItemForm } from '@/components/dashboard/CreateMenuItemForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';

type CreateMenuItemPageClientProps = {
  locale: string;
};

export function CreateMenuItemPageClient({ locale }: CreateMenuItemPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('dashboard.items');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-hlb-primary">{t('new')}</h1>
        <p className="text-hlb-text/80">{t('createSubtitle')}</p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-medium">{t('details')}</h2>
        </CardHeader>
        <CardBody>
          <CreateMenuItemForm
            onSuccess={() => {
              startTransition(() => {
                router.push(`/${locale}/dashboard?tab=menu-items`);
              });
            }}
          />
        </CardBody>
      </Card>
      <LoadingOverlay isLoading={isPending} />
    </div>
  );
}
