import PublicNavbar from '@/components/Navbar';
import { LanguagePreferencePrompt } from '@/components/LanguagePreferencePrompt';
import { checkUserOnboarded } from '@/utils/auth.utils';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await checkUserOnboarded();
  const isLoggedIn = userData !== null;
  const showDashboardLink = userData ? userData.role !== 'CUSTOMER' : false;
  return (
    <>
      <PublicNavbar showDashboardLink={showDashboardLink} isLoggedIn={isLoggedIn} />
      <LanguagePreferencePrompt />
      {children}
    </>
  );
}
