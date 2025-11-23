'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { UpdateMenuItemForm, type UpdateMenuItemFormProps } from '@/components/dashboard/UpdateMenuItemForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';

type EditMenuItemPageClientProps = {
  locale: string;
  itemId: string;
  item: UpdateMenuItemFormProps['item'];
};

export function EditMenuItemPageClient({ locale, itemId, item }: EditMenuItemPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('dashboard.items');

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
          <UpdateMenuItemForm
            itemId={itemId}
            item={item}
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
