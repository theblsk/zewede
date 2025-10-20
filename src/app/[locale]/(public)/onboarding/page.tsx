import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import OnboardingForm from '@/components/forms/OnboardingForm';
import { getCountryOptions } from '@/utils/country-codes';
import { checkUserOnboarded } from '@/utils/auth.utils';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const t = await getTranslations('onboarding.form');
  const userData = await checkUserOnboarded();
  const locale = await getLocale();
  if (userData) {
    redirect(`/${locale}`);
  }
  const countryOptions = getCountryOptions(locale);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-hlb-primary md:text-4xl">
          {t('title')}
        </h1>
        <p className="text-base text-hlb-text-light md:text-lg">
          {t('description')}
        </p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
        <OnboardingForm countryOptions={countryOptions} />
      </div>
    </section>
  );
}