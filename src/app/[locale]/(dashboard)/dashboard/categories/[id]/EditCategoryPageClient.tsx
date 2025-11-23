'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { UpdateCategoryForm, type UpdateCategoryFormProps } from '@/components/dashboard/UpdateCategoryForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';

type EditCategoryPageClientProps = {
  locale: string;
  categoryId: string;
  category: UpdateCategoryFormProps['category'];
};

export function EditCategoryPageClient({ locale, categoryId, category }: EditCategoryPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('dashboard.categories');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-hlb-primary">{t('edit')}</h1>
        <p className="text-hlb-text/80">{t('editSubtitle')}</p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-medium">{t('details')}</h2>
        </CardHeader>
        <CardBody>
          <UpdateCategoryForm
            categoryId={categoryId}
            category={category}
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
