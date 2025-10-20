import { checkUserOnboarded } from '@/utils/auth.utils';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const t = await getTranslations('dashboard');
  const locale = await getLocale();
  const userData = await checkUserOnboarded();
  if (!userData) {
    redirect(`/${locale}/onboarding`);
  }
  if (userData.role === 'CUSTOMER') {
    redirect(`/${locale}`);
  }
  return (
    <div className="min-h-screen bg-hlb-bg p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-hlb-primary mb-6">
          {t('title')}
        </h1>
        <p className="text-hlb-text">
          {t('welcome')}
        </p>
      </div>
    </div>
  );
}
