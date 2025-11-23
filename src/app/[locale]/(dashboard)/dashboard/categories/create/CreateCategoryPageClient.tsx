'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { CreateCategoryForm } from '@/components/dashboard/CreateCategoryForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';

type CreateCategoryPageClientProps = {
  locale: string;
};

export function CreateCategoryPageClient({ locale }: CreateCategoryPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('dashboard.categories');

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
          <CreateCategoryForm
            onSuccess={() => {
              startTransition(() => {
                router.push(`/${locale}/dashboard?tab=categories`);
              });
            }}
          />
        </CardBody>
      </Card>
      <LoadingOverlay isLoading={isPending} />
    </div>
  );
}
