import Hero from '@/components/Hero';
import MenuGrid from '@/components/MenuGrid';
import Contact from '@/components/Contact';
import { redirect } from 'next/navigation';
import { checkUserOnboarded } from '@/utils/auth.utils';
import { getLocale } from 'next-intl/server';

export default async function Home() {
  const locale = await getLocale();
  const userData = await checkUserOnboarded();
  
  // Only redirect to onboarding if user is logged in but not onboarded
  if (userData === undefined) {
    redirect(`/${locale}/onboarding`);
  }
  
  return (
    <main>
      <Hero />
      <MenuGrid />
      <Contact />
    </main>
  );
}
